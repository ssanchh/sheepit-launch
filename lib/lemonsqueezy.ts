import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface CreateCheckoutOptions {
  productId: string
  userId: string
  paymentType: 'skip_queue' | 'featured_product'
  redirectUrl?: string
  metadata?: Record<string, any>
}

export async function createCheckout({
  productId,
  userId,
  paymentType,
  redirectUrl = window.location.href,
  metadata = {}
}: CreateCheckoutOptions) {
  try {
    const supabase = createClient()
    
    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        product_id: productId,
        payment_type: paymentType,
        amount: paymentType === 'skip_queue' ? 35 : 45,
        currency: 'USD',
        status: 'pending',
        metadata: {
          ...metadata,
          product_id: productId,
          payment_type: paymentType
        }
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error('Failed to create payment record')
    }

    // Get the appropriate variant ID
    const variantId = paymentType === 'skip_queue' 
      ? process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID
      : process.env.NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_VARIANT_ID

    if (!variantId) {
      throw new Error('Payment configuration missing')
    }

    // Create Lemon Squeezy checkout URL
    const checkoutUrl = new URL('https://sheepit.lemonsqueezy.com/checkout')
    checkoutUrl.searchParams.append('variant', variantId)
    checkoutUrl.searchParams.append('checkout[custom][payment_id]', payment.id)
    checkoutUrl.searchParams.append('checkout[custom][user_id]', userId)
    checkoutUrl.searchParams.append('checkout[custom][product_id]', productId)
    checkoutUrl.searchParams.append('checkout[success_url]', redirectUrl)
    checkoutUrl.searchParams.append('checkout[cancel_url]', redirectUrl)

    // Update payment with checkout URL
    await supabase
      .from('payments')
      .update({ checkout_url: checkoutUrl.toString() })
      .eq('id', payment.id)

    // Redirect to checkout
    window.location.href = checkoutUrl.toString()
  } catch (error) {
    console.error('Checkout error:', error)
    toast.error('Failed to create checkout. Please try again.')
    throw error
  }
}

export async function checkPaymentStatus(paymentId: string) {
  const supabase = createClient()
  
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  return payment
}