import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@13.6.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize Supabase Client with Service Role Key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      const eventId = session.metadata?.eventId
      const planId = session.metadata?.planId
      
      if (eventId && planId) {
        // 1. Get the exact plan UUID from our plans table
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id')
          .eq('code', planId)
          .single();

        if (planError || !planData) {
          console.error(`Error finding plan UUID for code: ${planId}`, planError);
          return new Response('Plan not found in DB', { status: 400 });
        }

        // 2. Update Event Subscription securely bypassing RLS
        const { error: subError } = await supabase
          .from('event_subscriptions')
          .upsert({ 
            event_id: eventId,
            plan_id: planData.id,
            status: 'active',
            updated_at: new Date().toISOString()
          }, { onConflict: 'event_id' });

        if (subError) {
          console.error(`Error upserting subscription for event ${eventId}:`, subError);
          return new Response('DB Error updating subscription', { status: 500 });
        }

        // 3. We also need to get the user ID for this event to update their profile tier
        const { data: eventData } = await supabase
          .from('events')
          .select('user_id')
          .eq('id', eventId)
          .single();

        if (eventData?.user_id) {
          await supabase
            .from('profiles')
            .update({ plan_tier: planId })
            .eq('id', eventData.user_id);
        }

        console.log(`Successfully upgraded event ${eventId} to plan ${planId}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook processing failed:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
