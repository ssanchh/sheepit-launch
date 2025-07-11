import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, processSuccessfulPayment } from '@/lib/lemon-squeezy'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text()
    
    // Get signature from headers
    const signature = request.headers.get('x-signature') || ''
    
    // Verify webhook signature
    if (!verifyWebhookSignature(signature, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    // Parse the body
    const data = JSON.parse(body)
    
    // Handle different event types
    const eventType = data.meta?.event_name
    
    switch (eventType) {
      case 'order_created':
        // Payment successful
        const customData = data.meta?.custom_data
        if (customData?.payment_id) {
          await processSuccessfulPayment(customData.payment_id, {
            order_id: data.data?.id,
            customer_id: data.data?.attributes?.customer_id,
            receipt_url: data.data?.attributes?.urls?.receipt,
            ...data.data?.attributes
          })
        }
        break
        
      case 'order_refunded':
        // Handle refunds
        const orderId = data.data?.id
        if (orderId) {
          const supabase = createClient()
          await supabase
            .from('payments')
            .update({ status: 'refunded' })
            .eq('ls_order_id', orderId)
        }
        break
        
      // Add more event types as needed
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}