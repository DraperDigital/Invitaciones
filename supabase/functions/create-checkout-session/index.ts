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

    const { planId, eventId, origin } = await req.json()

    if (!planId || !eventId || !origin) {
      throw new Error('Missing required parameters')
    }

    // Map the planId to Stripe Price ID
    let priceId = '';
    switch (planId) {
      case 'clasico':
        priceId = 'price_1U9xICK2PT24BEhhOBxEkVi4';
        break;
      case 'pro':
        priceId = 'price_1U9xIoK2PT24BEhhjs4oiIqv';
        break;
      case 'premium': // Diseño Pro
        priceId = 'price_1U9xJYK2PT24BEhhIXcFYNIx';
        break;
      case 'concierge':
        priceId = 'price_1U9xM8K2PT24BEhhAzia2B4d';
        break;
      default:
        throw new Error('Invalid plan ID');
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard/design/${eventId}?upgrade=success`,
      cancel_url: `${origin}/checkout?plan=${planId}&id=${eventId}&canceled=true`,
      client_reference_id: eventId,
      metadata: {
        planId: planId,
        eventId: eventId,
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
