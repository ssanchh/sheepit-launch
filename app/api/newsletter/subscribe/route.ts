import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if email already exists in newsletter_subscribers table
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle() // Use maybeSingle instead of single to avoid error when no row exists

    if (selectError) {
      console.error('Newsletter select error:', selectError)
      return NextResponse.json(
        { error: `Database error: ${selectError.message}` },
        { status: 500 }
      )
    }

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'You are already subscribed!' },
        { status: 400 }
      )
    }

    // Add to newsletter_subscribers table
    const { data, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        first_name: firstName || null,
        subscribed_at: new Date().toISOString(),
        status: 'active'
      })
      .select()

    if (insertError) {
      console.error('Newsletter insert error:', insertError)
      
      // Provide more specific error messages
      if (insertError.code === '42P01') {
        return NextResponse.json(
          { error: 'Newsletter table not found. Please contact support.' },
          { status: 500 }
        )
      }
      
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to subscribe: ${insertError.message}` },
        { status: 500 }
      )
    }

    console.log('Newsletter subscription successful:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}