// Test payment endpoint for development
// This simulates a successful payment without needing webhooks

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
    
    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        product_id: productId,
        payment_type: paymentType,
        amount: paymentType === 'skip_queue' ? 35 : 45,
        currency: 'USD',
        status: 'completed',
        completed_at: new Date().toISOString(),
        ls_order_id: `test_${Date.now()}`,
        metadata: { test_mode: true }
      })
      .select()
      .single()
    
    if (paymentError || !payment) {
      console.error('Payment error:', paymentError)
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }
    
    // Apply the benefit based on payment type
    if (paymentType === 'skip_queue') {
      // Get current queue position
      const { data: product } = await supabase
        .from('products')
        .select('queue_position')
        .eq('id', productId)
        .single()
      
      if (product?.queue_position) {
        // Create queue skip record
        await supabase
          .from('queue_skips')
          .insert({
            payment_id: payment.id,
            product_id: productId,
            original_position: product.queue_position,
            new_position: 1
          })
        
        // Apply the queue skip
        await supabase.rpc('apply_queue_skip', { p_payment_id: payment.id })
      }
    } else if (paymentType === 'featured_product') {
      // Create featured purchase
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)
      
      await supabase
        .from('featured_purchases')
        .insert({
          payment_id: payment.id,
          product_id: productId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          active: true
        })
      
      // Update product to show it's featured
      await supabase
        .from('products')
        .update({ 
          payment_status: 'featured',
          paid_features: { featured: true, featured_until: endDate.toISOString() }
        })
        .eq('id', productId)
    }
    
    return NextResponse.json({ 
      success: true, 
      payment,
      redirectUrl: `/payment-success?type=${paymentType}`
    })
  } catch (error) {
    console.error('Test payment error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}