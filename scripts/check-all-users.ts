import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAllUsers() {
  console.log('Checking all users...\n')
  
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, created_at, profile_completed')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Total users: ${users?.length || 0}\n`)
  
  // Check newsletter status for each
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email, status, source')
  
  const subMap = new Map(subscribers?.map(s => [s.email, s]) || [])
  
  for (const user of users || []) {
    const sub = subMap.get(user.email)
    console.log(`Email: ${user.email}`)
    console.log(`Profile Complete: ${user.profile_completed ? 'Yes' : 'No'}`)
    console.log(`Newsletter: ${sub ? `${sub.status} (via ${sub.source})` : 'Not subscribed'}`)
    console.log('---')
  }
}

checkAllUsers()