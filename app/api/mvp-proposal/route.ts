import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, idea, features, timeline } = await request.json()

    // Validate required fields
    if (!name || !email || !idea || !features || !timeline) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Insert the proposal
    const { data, error } = await supabase
      .from('mvp_proposals')
      .insert({
        name,
        email,
        idea,
        features,
        timeline
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting MVP proposal:', error)
      return NextResponse.json(
        { error: 'Failed to submit proposal' },
        { status: 500 }
      )
    }

    // Send notification email to admin (optional - you can implement this later)
    // For now, we'll just log it
    console.log('New MVP proposal submitted:', {
      name,
      email,
      id: data.id
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Proposal submitted successfully',
        id: data.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing MVP proposal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}