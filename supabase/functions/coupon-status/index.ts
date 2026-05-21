// Public read-only endpoint that returns availability info for a coupon.
// Used by <LaunchPromoPopup /> to show a live counter ("Quedan 7 de 10").
// Does NOT require auth — only exposes counts, never the discount logic.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=60', // 1 min cache on the edge — enough freshness for a UI counter
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      throw new Error('Missing code parameter')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('max_uses, current_uses, active, expires_at')
      .eq('code', code.toUpperCase())
      .maybeSingle()

    if (error || !coupon) {
      return new Response(
        JSON.stringify({ available: false, remaining: 0, max: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const remaining = Math.max(0, coupon.max_uses - coupon.current_uses)
    const expired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
    const available = coupon.active !== false && remaining > 0 && !expired

    return new Response(
      JSON.stringify({
        available,
        remaining,
        max: coupon.max_uses,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ available: false, remaining: 0, max: 0, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
