import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createCheckoutUrl } from '@/lib/lemon-squeezy'
import { ApiError, handleApiError, requireAuth } from '@/lib/api-error-handler'

export async function POST(request: NextRequest) {
  try {
    const { paymentType, productId } = await request.json()
    
    if (!paymentType || !productId) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS')
    }
    
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    requireAuth(user)
    
    if (!user) {
      throw new ApiError('User not authenticated', 401, 'UNAUTHORIZED')
    }
    
    // Verify the product belongs to the user
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('created_by', user.id)
      .single()
    
    if (productError || !product) {
      throw new ApiError('Product not found', 404, 'PRODUCT_NOT_FOUND')
    }
    
    // Check if product is eligible for the payment type
    if (paymentType === 'skip_queue') {
      // Product must be in queue (have a queue_position)
      if (!product.queue_position) {
        throw new ApiError('Product is not in queue', 400, 'NOT_IN_QUEUE')
      }
    } else if (paymentType === 'featured_product') {
      // Product must be approved
      if (product.status !== 'approved') {
        throw new ApiError('Product must be approved first', 400, 'NOT_APPROVED')
      }
    }
    
    // Create checkout URL
    console.log('Creating checkout for:', { paymentType, productId, userId: user.id })
    
    const { checkoutUrl, paymentId } = await createCheckoutUrl(
      paymentType,
      productId,
      user.id,
      user.email || ''
    )
    
    return NextResponse.json({ checkoutUrl, paymentId })
  } catch (error) {
    return handleApiError(error)
  }
}