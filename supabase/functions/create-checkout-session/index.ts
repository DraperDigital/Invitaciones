import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@13.6.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const dbSchema = Deno.env.get('SUPABASE_DB_SCHEMA') || 'invitto'
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: dbSchema },
})

const PLANS: Record<string, { name: string; price: number; priceId: string }> = {
  clasico: {
    name: 'Clásica',
    price: 499,
    priceId: 'price_1Ud3rgK2SjbKQms7CYNbOWmB',
  },
  pro: {
    name: 'Pro',
    price: 1699,
    priceId: 'price_1Ud3rvK2SjbKQms7MQRUtsM2',
  },
  premium: {
    name: 'Diseño Pro',
    price: 2499,
    priceId: 'price_1Ud3s5K2SjbKQms7y9ZQI4vY',
  },
  concierge: {
    name: 'Concierge',
    price: 4499,
    priceId: 'price_1Ud3sEK2SjbKQms7PXykglMR',
  },
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

    const body = await req.json()
    // NUNCA aceptamos 'amount' desde el cliente; se calcula estrictamente en el servidor
    const { sessionId, planId, eventId, origin, email, fbp, fbc, coupon } = body

    // Consultar el estado de una sesión de Stripe
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      return new Response(
        JSON.stringify({
          id: session.id,
          payment_status: session.payment_status,
          status: session.status,
          amount_total: session.amount_total,
          planId: session.metadata?.planId,
          eventId: session.metadata?.eventId,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (!planId || !eventId || !origin) {
      throw new Error('Missing required parameters')
    }

    const planConfig = PLANS[planId]
    if (!planConfig) {
      throw new Error('Invalid plan ID')
    }

    let finalPrice = planConfig.price
    let cleanCoupon: string | undefined = undefined

    // Si se envió cupón, se vuelve a validar en el servidor contra invitto.coupons
    if (coupon && typeof coupon === 'string' && coupon.trim()) {
      cleanCoupon = coupon.trim().toUpperCase()

      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', cleanCoupon)
        .maybeSingle()

      if (couponError || !couponData) {
        throw new Error('Cupón inválido o no encontrado.')
      }

      if (couponData.active === false) {
        throw new Error('Este cupón no se encuentra activo.')
      }

      if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
        throw new Error('Este cupón ya ha expirado.')
      }

      if (
        typeof couponData.max_uses === 'number' &&
        typeof couponData.current_uses === 'number' &&
        couponData.current_uses >= couponData.max_uses
      ) {
        throw new Error('Este cupón ya ha alcanzado su límite de usos.')
      }

      // Validar plan_id: si está vacío, aplica a cualquier plan
      if (couponData.plan_id && String(couponData.plan_id).trim() !== '') {
        if (String(couponData.plan_id).trim().toLowerCase() !== planId.trim().toLowerCase()) {
          throw new Error('Este cupón no es válido para el plan seleccionado.')
        }
      }

      // Calcular precio en el servidor:
      // 1) override_price
      // 2) discount_percent (redondeado a pesos)
      // 3) solo si no tiene ninguno cubre el 100%
      const hasOverride = couponData.override_price !== null && couponData.override_price !== undefined && couponData.override_price !== '' && !isNaN(Number(couponData.override_price))
      const hasPercent = couponData.discount_percent !== null && couponData.discount_percent !== undefined && couponData.discount_percent !== '' && !isNaN(Number(couponData.discount_percent))

      if (hasOverride) {
        finalPrice = Math.max(0, Math.round(Number(couponData.override_price)))
      } else if (hasPercent) {
        const percent = Math.min(100, Math.max(0, Number(couponData.discount_percent)))
        const discount = Math.round((planConfig.price * percent) / 100)
        finalPrice = Math.max(0, planConfig.price - discount)
      } else {
        finalPrice = 0
      }

      if (finalPrice <= 0) {
        throw new Error('Este cupón cubre el 100% y no requiere pasarela de pago.')
      }
    }

    // Configurar line_items: si hay descuento calculado en servidor usamos price_data, sino el precio estándar
    const lineItems = (cleanCoupon && finalPrice < planConfig.price) ? [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Plan ${planConfig.name} (Cupón ${cleanCoupon})`,
          },
          unit_amount: finalPrice * 100,
        },
        quantity: 1,
      },
    ] : [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ]

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'oxxo'],
      payment_method_options: {
        card: { installments: { enabled: true } },
        oxxo: { expires_after_days: 3 },
      },
      customer_creation: 'always',
      ...(email ? { customer_email: email } : {}),
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/dashboard/design/${eventId}?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?plan=${planId}&id=${eventId}&canceled=true`,
      client_reference_id: eventId,
      metadata: {
        planId: planId,
        eventId: eventId,
        ...(cleanCoupon ? { coupon: cleanCoupon } : {}),
        ...(cleanCoupon ? { amount: String(finalPrice) } : {}),
        ...(fbp ? { fbp: String(fbp) } : {}),
        ...(fbc ? { fbc: String(fbc) } : {}),
      }
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
