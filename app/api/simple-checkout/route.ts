// Simplified checkout for testing without database
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { paymentType, productId } = await request.json()
    
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get variant ID based on payment type
    const variantId = paymentType === 'skip_queue' 
      ? process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID
      : process.env.NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_VARIANT_ID
    
    // Build simple checkout URL
    const checkoutUrl = `https://sheepit.lemonsqueezy.com/checkout/buy/${variantId}?checkout[email]=${encodeURIComponent(user.email || '')}&checkout[custom][product_id]=${productId}&checkout[custom][user_id]=${user.id}&checkout[custom][payment_type]=${paymentType}`
    
    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error('Simple checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}