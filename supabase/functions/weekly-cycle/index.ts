import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeeklyResult {
  newWeekId?: string
  winnersCreated?: number
  errors?: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const result: WeeklyResult = {
      errors: []
    }

    // Get current date and calculate week boundaries
    const now = new Date()
    const dayOfWeek = now.getDay()
    
    // Check if it's Sunday (end of week) or Monday (start of week)
    // This function should run on Sunday night to close the week
    // and Monday morning to start a new week
    
    if (dayOfWeek === 0) { // Sunday - Close current week
      console.log('Sunday: Closing current week and determining winners')
      
      // Get current active week
      const { data: currentWeek, error: weekError } = await supabase
        .from('weeks')
        .select('*')
        .eq('active', true)
        .single()

      if (weekError || !currentWeek) {
        result.errors?.push('No active week found')
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }

      // Get top 3 products by votes for this week
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          votes!inner(count)
        `)
        .eq('status', 'approved')
        .eq('week_id', currentWeek.id)
        .order('votes.count', { ascending: false })
        .limit(3)

      if (!productsError && products && products.length > 0) {
        // Create winner entries
        const winners = products.map((product, index) => ({
          product_id: product.id,
          week_id: currentWeek.id,
          position: index + 1,
          badge_url: null // Will be generated client-side
        }))

        const { error: winnersError } = await supabase
          .from('winners')
          .insert(winners)

        if (winnersError) {
          result.errors?.push(`Failed to create winners: ${winnersError.message}`)
        } else {
          result.winnersCreated = winners.length
        }
      }

      // Mark week as inactive
      const { error: updateError } = await supabase
        .from('weeks')
        .update({ active: false })
        .eq('id', currentWeek.id)

      if (updateError) {
        result.errors?.push(`Failed to close week: ${updateError.message}`)
      }

    } else if (dayOfWeek === 1) { // Monday - Start new week
      console.log('Monday: Starting new week')
      
      // Calculate week start and end dates
      const weekStart = new Date(now)
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      // Create new week
      const { data: newWeek, error: createError } = await supabase
        .from('weeks')
        .insert({
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString(),
          active: true
        })
        .select()
        .single()

      if (createError) {
        result.errors?.push(`Failed to create new week: ${createError.message}`)
      } else {
        result.newWeekId = newWeek.id
        
        // Optional: Send notification emails to users about new week
        // This would integrate with your email service
      }

    } else {
      // Not Sunday or Monday - do nothing
      return new Response(JSON.stringify({ 
        message: 'Weekly cycle runs only on Sundays and Mondays',
        currentDay: dayOfWeek 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Return results
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.errors?.length ? 400 : 200
    })

  } catch (error) {
    console.error('Weekly cycle error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})