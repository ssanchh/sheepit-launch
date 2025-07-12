// Lemon Squeezy configuration and helpers
import { createClient } from '@/utils/supabase/client'

// Lemon Squeezy configuration
export const LEMON_SQUEEZY_CONFIG = {
  // These will be set from environment variables
  storeId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID!,
  apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
  webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!,
  
  // Product/variant IDs - you'll need to create these in Lemon Squeezy
  products: {
    skipQueue: {
      productId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_PRODUCT_ID!,
      variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID!,
      price: 35,
      name: 'Premium Launch - Skip the Queue'
    },
    featured: {
      productId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_PRODUCT_ID!,
      variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_VARIANT_ID!,
      price: 30,
      name: 'Featured Spot (Weekly)'
    }
  }
}

// Create checkout URL for Lemon Squeezy
export async function createCheckoutUrl(
  paymentType: 'skip_queue' | 'featured_product',
  productId: string,
  userId: string,
  userEmail: string
) {
  const supabase = createClient()
  
  // Create pending payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      product_id: productId,
      payment_type: paymentType,
      amount: paymentType === 'skip_queue' ? 35 : 30,
      currency: 'USD',
      status: 'pending'
    })
    .select()
    .single()

  if (paymentError || !payment) {
    console.error('Payment creation error:', paymentError)
    throw new Error(`Failed to create payment record: ${paymentError?.message || 'Unknown error'}`)
  }

  // Get the product config
  const productConfig = paymentType === 'skip_queue' 
    ? LEMON_SQUEEZY_CONFIG.products.skipQueue 
    : LEMON_SQUEEZY_CONFIG.products.featured

  // Build Lemon Squeezy checkout URL
  const checkoutUrl = new URL('https://sheepit.lemonsqueezy.com/checkout/buy/' + productConfig.variantId)
  
  // Add custom data that will be returned in webhook
  checkoutUrl.searchParams.set('checkout[email]', userEmail)
  checkoutUrl.searchParams.set('checkout[custom][payment_id]', payment.id)
  checkoutUrl.searchParams.set('checkout[custom][user_id]', userId)
  checkoutUrl.searchParams.set('checkout[custom][product_id]', productId)
  checkoutUrl.searchParams.set('checkout[custom][payment_type]', paymentType)

  // Store checkout URL in payment record
  await supabase
    .from('payments')
    .update({ checkout_url: checkoutUrl.toString() })
    .eq('id', payment.id)

  return {
    checkoutUrl: checkoutUrl.toString(),
    paymentId: payment.id
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  signature: string,
  body: string
): boolean {
  // Implementation will depend on Lemon Squeezy's webhook signature format
  // This is a placeholder - check Lemon Squeezy docs for exact implementation
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_CONFIG.webhookSecret)
  hmac.update(body)
  const expectedSignature = hmac.digest('hex')
  
  return signature === expectedSignature
}

// Process successful payment
export async function processSuccessfulPayment(
  paymentId: string,
  lemonSqueezyData: any
) {
  const supabase = createClient()
  
  // Update payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ls_order_id: lemonSqueezyData.order_id,
      ls_customer_id: lemonSqueezyData.customer_id,
      receipt_url: lemonSqueezyData.receipt_url,
      metadata: lemonSqueezyData
    })
    .eq('id', paymentId)
    .select()
    .single()

  if (paymentError || !payment) {
    throw new Error('Failed to update payment record')
  }

  // Process based on payment type
  if (payment.payment_type === 'skip_queue') {
    // Create queue skip record
    await supabase
      .from('queue_skips')
      .insert({
        payment_id: payment.id,
        product_id: payment.product_id,
        original_position: 999, // Will be set when applied
        new_position: 1
      })
    
    // Create guaranteed backlink for premium
    const { data: product } = await supabase
      .from('products')
      .select('name')
      .eq('id', payment.product_id)
      .single()
    
    if (product) {
      await supabase
        .from('product_backlinks')
        .insert({
          product_id: payment.product_id,
          payment_id: payment.id,
          anchor_text: product.name,
          target_url: `https://sheepit.io/product/${payment.product_id}`,
          is_dofollow: true,
          is_active: true
        })
    }
  } else if (payment.payment_type === 'featured_product') {
    // Create featured rotation record
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7) // 7 days featured
    
    await supabase
      .from('featured_rotation')
      .insert({
        product_id: payment.product_id,
        payment_id: payment.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        rotation_order: 0
      })
    
    // Also create featured purchase for backwards compatibility
    await supabase
      .from('featured_purchases')
      .insert({
        payment_id: payment.id,
        product_id: payment.product_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        active: true
      })
    
    // Update product to show as featured
    await supabase
      .from('products')
      .update({ is_featured_rotation: true })
      .eq('id', payment.product_id)
  }

  return payment
}