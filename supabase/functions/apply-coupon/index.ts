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

    const { couponCode, eventId, planId } = await req.json()

    if (!couponCode || !eventId || !planId) {
      throw new Error('Missing required parameters')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    // 1. Verify coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single()

    if (couponError || !coupon) {
      throw new Error('Cupón inválido.')
    }

    if (coupon.current_uses >= coupon.max_uses) {
      throw new Error('Este cupón ya ha alcanzado su límite de usos.')
    }

    // Check if the plan is allowed for this coupon
    // "INVITTO26" allows 'clasico' and 'premium'
    if (coupon.code === 'INVITTO26') {
      if (planId !== 'clasico' && planId !== 'premium') {
        throw new Error('Este cupón solo es válido para los planes Clásica y Diseño Pro.')
      }
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

    // 4. Update Event Subscription
    const { error: subError } = await supabase
      .from('event_subscriptions')
      .upsert({ 
        event_id: eventId,
        plan_id: planData.id,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'event_id' });

    if (subError) throw subError;

    // 5. Update Profile
    await supabase
      .from('profiles')
      .update({ plan_tier: planId })
      .eq('id', user.id);

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
