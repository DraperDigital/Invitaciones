import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@13.6.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

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

    const body = await req.json()
    const { sessionId, planId, eventId, origin, email, fbp, fbc } = body

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

    // Map the planId to Stripe Price ID
    let priceId = '';
    switch (planId) {
      case 'clasico':
        priceId = 'price_1Ud3rgK2SjbKQms7CYNbOWmB';
        break;
      case 'pro':
        priceId = 'price_1Ud3rvK2SjbKQms7MQRUtsM2';
        break;
      case 'premium': // Diseño Pro
        priceId = 'price_1Ud3s5K2SjbKQms7y9ZQI4vY';
        break;
      case 'concierge':
        priceId = 'price_1Ud3sEK2SjbKQms7PXykglMR';
        break;
      default:
        throw new Error('Invalid plan ID');
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'oxxo'],
      payment_method_options: {
        card: { installments: { enabled: true } },
        oxxo: { expires_after_days: 3 },
      },
      customer_creation: 'always',
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard/design/${eventId}?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?plan=${planId}&id=${eventId}&canceled=true`,
      client_reference_id: eventId,
      metadata: {
        planId: planId,
        eventId: eventId,
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
