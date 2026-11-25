import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { couponCode, eventId, planId, checkOnly } = await req.json()

    if (!couponCode || !eventId || !planId) {
      throw new Error('Missing required parameters')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const dbSchema = Deno.env.get('SUPABASE_DB_SCHEMA') || 'invitto';
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: dbSchema }
    });

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    // 0. Verify event exists and belongs to this user
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id, user_id, theme_config')
      .eq('id', eventId)
      .single();

    if (eventError || !eventData) {
      throw new Error('Evento no encontrado.')
    }

    if (eventData.user_id !== user.id) {
      throw new Error('No tienes permisos para modificar este evento.')
    }

    // 1. Verify coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single()

    if (couponError || !coupon) {
      throw new Error('Cupón inválido o no encontrado.')
    }

    if (coupon.active === false) {
      throw new Error('Este cupón no se encuentra activo.')
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      throw new Error('Este cupón ha expirado.')
    }

    if (typeof coupon.max_uses === 'number' && typeof coupon.current_uses === 'number' && coupon.current_uses >= coupon.max_uses) {
      throw new Error('Este cupón ya ha alcanzado su límite de usos.')
    }

    // Validar plan_id: si está vacío, aplica a cualquier plan
    if (coupon.plan_id && coupon.plan_id.trim() !== '') {
      if (coupon.plan_id.trim().toLowerCase() !== planId.trim().toLowerCase()) {
        throw new Error('Este cupón no es válido para el plan seleccionado.')
      }
    }

    // Check if the plan is allowed for this coupon legacy rule
    if (coupon.code === 'INVITTO26') {
      if (planId !== 'clasico' && planId !== 'premium') {
        throw new Error('Este cupón solo es válido para los planes Clásica y Diseño Pro.')
      }
    }

    if (coupon.code === 'SOPHIAHUETT') {
      if (planId !== 'clasico' && planId !== 'pro') {
        throw new Error('Este cupón solo es válido para los planes Clásica y Pro.')
      }
    }

    const hasOverride = coupon.override_price !== null && coupon.override_price !== undefined && coupon.override_price !== ''
    const discountPercent = (coupon.discount_percent !== null && coupon.discount_percent !== undefined && coupon.discount_percent !== '')
      ? Number(coupon.discount_percent)
      : null

    if (checkOnly) {
      return new Response(
        JSON.stringify({
          success: true,
          coupon: {
            code: coupon.code,
            active: coupon.active,
            expires_at: coupon.expires_at,
            max_uses: coupon.max_uses,
            current_uses: coupon.current_uses,
            plan_id: coupon.plan_id,
            override_price: coupon.override_price,
            discount_percent: coupon.discount_percent,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Regla estricta: solo activa el plan sin pago si el cupón no tiene override_price y su discount_percent es nulo o 100
    const isFreeAllowed = !hasOverride && (discountPercent === null || discountPercent === 100)
    if (!isFreeAllowed) {
      throw new Error('Este cupón no cubre el plan al 100% y requiere pago en el checkout.')
    }

    // 2. Increment coupon usage
    const { error: updateCouponError } = await supabase
      .rpc('increment_coupon_use', { coupon_code: coupon.code })
      
    // If we don't have RPC, just do an update (Note: subject to race conditions but fine for MVP)
    if (updateCouponError) {
      await supabase
        .from('coupons')
        .update({ current_uses: coupon.current_uses + 1 })
        .eq('code', coupon.code)
    }

    // 3. Find plan UUID
    const { data: planData } = await supabase
      .from('plans')
      .select('id')
      .eq('code', planId)
      .single();

    if (!planData) {
      throw new Error('Plan not found')
    }

    // Check if subscription already exists to avoid ON CONFLICT database constraint issues
    const { data: existingSub, error: findSubError } = await supabase
      .from('event_subscriptions')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (findSubError) throw findSubError;

    let subError;
    if (existingSub) {
      const { error } = await supabase
        .from('event_subscriptions')
        .update({ 
          plan_id: planData.id,
          status: 'active'
        })
        .eq('event_id', eventId);
      subError = error;
    } else {
      const { error } = await supabase
        .from('event_subscriptions')
        .insert({ 
          event_id: eventId,
          plan_id: planData.id,
          status: 'active'
        });
      subError = error;
    }

    if (subError) throw subError;

    // 5. Update Profile
    await supabase
      .from('profiles')
      .update({ plan_tier: planId })
      .eq('id', user.id);

    // 6. Update theme_config to add plan_tier, isPremium, isPro and publish the event
    let themeConfig = eventData.theme_config || {};
    if (typeof themeConfig === 'string') {
      try { themeConfig = JSON.parse(themeConfig); } catch { themeConfig = {}; }
    }
    const isPrem = planId === 'premium' || planId === 'concierge';
    const isPr = planId === 'pro' || isPrem;
    const updatedThemeConfig = { ...themeConfig, plan_tier: planId, isPremium: isPrem, isPro: isPr };

    await supabase
      .from('events')
      .update({
        is_published: true,
        theme_config: updatedThemeConfig
      })
      .eq('id', eventId);

    return new Response(
      JSON.stringify({ success: true, message: 'Cupón aplicado con éxito.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
