import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkRecentSignups() {
  console.log('Checking recent signups...\n')
  
  // Get users created in the last 7 days
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  
  const { data: recentUsers, error } = await supabase
    .from('users')
    .select('id, email, created_at, profile_completed')
    .gte('created_at', lastWeek.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Found ${recentUsers?.length || 0} users signed up in last 7 days:\n`)
  
  for (const user of recentUsers || []) {
    console.log(`Email: ${user.email}`)
    console.log(`Created: ${new Date(user.created_at).toLocaleString()}`)
    console.log(`Profile Completed: ${user.profile_completed ? 'Yes' : 'No'}`)
    
    // Check if in newsletter
    const { data: newsletterSub } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', user.email)
      .single()
    
    console.log(`Newsletter Status: ${newsletterSub ? `Subscribed (${newsletterSub.status})` : 'Not subscribed'}`)
    console.log('---')
  }
}

checkRecentSignups()