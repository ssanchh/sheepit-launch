import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { ApiError, handleApiError } from '@/lib/api-error-handler'
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/lib/newsletter/beehiiv'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, userId, source } = await request.json()
    
    if (!email) {
      throw new ApiError('Email is required', 400, 'EMAIL_REQUIRED')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ApiError('Invalid email format', 400, 'INVALID_EMAIL')
    }

    const supabase = createClient()
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        throw new ApiError('This email is already subscribed', 400, 'ALREADY_SUBSCRIBED')
      }
      
      // Reactivate subscription
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'pending',
          first_name: firstName || null,
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) throw error

      // Resubscribe to Beehiiv
      const result = await subscribeToNewsletter(email, userId || user?.id, source || 'website_reactivation')
      
      if (!result.success) {
        // Update status to failed
        await supabase
          .from('newsletter_subscribers')
          .update({ status: 'failed' })
          .eq('email', email)
        
        throw new ApiError(
          result.error || 'Failed to reactivate newsletter subscription',
          500,
          'BEEHIIV_ERROR'
        )
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Welcome back! Your subscription has been reactivated.' 
      })
    }

    // Create new subscription
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        first_name: firstName || null,
        user_id: userId || user?.id || null,
        source: source || 'website',
        status: 'pending', // Will be updated to active after Beehiiv confirms
      })

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ApiError('This email is already subscribed', 400, 'ALREADY_SUBSCRIBED')
      }
      throw error
    }

    // Subscribe to Beehiiv
    const result = await subscribeToNewsletter(email, userId || user?.id, source || 'website')
    
    if (!result.success) {
      // Update status to failed
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'failed' })
        .eq('email', email)
      
      throw new ApiError(
        result.error || 'Failed to subscribe to newsletter',
        500,
        'BEEHIIV_ERROR'
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to the newsletter!' 
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      throw new ApiError('Email is required', 400, 'EMAIL_REQUIRED')
    }

    const supabase = createClient()
    
    // Update subscription status
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (error) throw error

    // Unsubscribe from Beehiiv
    const result = await unsubscribeFromNewsletter(email)
    
    if (!result.success) {
      console.error('Failed to unsubscribe from Beehiiv:', result.error)
      // Don't throw error - we've already updated our database
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed from the newsletter.' 
    })
  } catch (error) {
    return handleApiError(error)
  }
}