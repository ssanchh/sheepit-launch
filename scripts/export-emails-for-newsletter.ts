import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { writeFileSync } from 'fs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function exportEmailsForNewsletter() {
  console.log('Exporting emails for newsletter...\n')
  
  // Get all users who want newsletter (profile_completed = true means they're active)
  const { data: users, error } = await supabase
    .from('users')
    .select('email, first_name, last_name, created_at')
    .eq('profile_completed', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  if (!users || users.length === 0) {
    console.log('No users found')
    return
  }
  
  console.log(`Found ${users.length} active users`)
  
  // Create CSV content
  const csvHeader = 'email,first_name,last_name,signup_date\n'
  const csvContent = users.map(user => 
    `${user.email},${user.first_name || ''},${user.last_name || ''},${new Date(user.created_at).toLocaleDateString()}`
  ).join('\n')
  
  const fullCsv = csvHeader + csvContent
  
  // Save to file with today's date
  const today = new Date().toISOString().split('T')[0]
  const filename = `newsletter-export-${today}.csv`
  
  writeFileSync(filename, fullCsv)
  console.log(`\n✅ Exported to ${filename}`)
  console.log('\nNext steps:')
  console.log('1. Go to Beehiiv dashboard')
  console.log('2. Click "Subscribers" → "Import"')
  console.log('3. Upload this CSV file')
  console.log('4. Beehiiv will handle duplicates automatically')
}

// Also export just this week's new signups
async function exportWeeklyNewSignups() {
  console.log('\n---\nExporting this week\'s new signups...\n')
  
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const { data: newUsers, error } = await supabase
    .from('users')
    .select('email, first_name, last_name, created_at')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  if (!newUsers || newUsers.length === 0) {
    console.log('No new users this week')
    return
  }
  
  console.log(`Found ${newUsers.length} new users this week:`)
  newUsers.forEach(user => {
    console.log(`- ${user.email} (${new Date(user.created_at).toLocaleDateString()})`)
  })
  
  // Create CSV for weekly signups
  const csvHeader = 'email,first_name,last_name,signup_date\n'
  const csvContent = newUsers.map(user => 
    `${user.email},${user.first_name || ''},${user.last_name || ''},${new Date(user.created_at).toLocaleDateString()}`
  ).join('\n')
  
  const fullCsv = csvHeader + csvContent
  
  const today = new Date().toISOString().split('T')[0]
  const filename = `weekly-new-signups-${today}.csv`
  
  writeFileSync(filename, fullCsv)
  console.log(`\n✅ Weekly signups exported to ${filename}`)
}

// Run both exports
async function main() {
  await exportEmailsForNewsletter()
  await exportWeeklyNewSignups()
}

main()