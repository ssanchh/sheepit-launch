import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get the action from request body
    const { action } = await request.json()
    
    if (!['close_week', 'start_week'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // For now, we'll handle it directly here since Edge Functions require deployment
    const now = new Date()
    
    if (action === 'close_week') {
      // Get current active week
      const { data: currentWeek, error: weekError } = await supabase
        .from('weeks')
        .select('*')
        .eq('active', true)
        .single()

      if (weekError || !currentWeek) {
        return NextResponse.json({ error: 'No active week found' }, { status: 400 })
      }

      // Get top 3 products by votes
      const { data: topProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .order('vote_count', { ascending: false })
        .limit(3)

      if (!productsError && topProducts && topProducts.length > 0) {
        // Create winner entries
        const winners = topProducts.map((product, index) => ({
          product_id: product.id,
          week_id: currentWeek.id,
          position: index + 1
        }))

        await supabase.from('winners').insert(winners)
      }

      // Mark week as inactive
      await supabase
        .from('weeks')
        .update({ active: false })
        .eq('id', currentWeek.id)

      return NextResponse.json({ 
        message: 'Week closed successfully',
        winners: topProducts?.length || 0
      })

    } else if (action === 'start_week') {
      // First, ensure no week is active
      await supabase
        .from('weeks')
        .update({ active: false })
        .eq('active', true)

      // Calculate week boundaries
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      // Create new week
      const { data: newWeek, error: createError } = await supabase
        .from('weeks')
        .insert({
          start_date: weekStart.toISOString().split('T')[0],
          end_date: weekEnd.toISOString().split('T')[0],
          active: true
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      return NextResponse.json({ 
        message: 'New week started successfully',
        weekId: newWeek.id,
        dates: {
          start: weekStart.toISOString().split('T')[0],
          end: weekEnd.toISOString().split('T')[0]
        }
      })
    }

  } catch (error: any) {
    console.error('Weekly cycle error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}