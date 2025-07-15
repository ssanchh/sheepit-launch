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
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('email, first_name, last_name, created_at')
    .eq('profile_completed', true)
    .order('created_at', { ascending: false })
  
  // Also get newsletter subscribers
  const { data: newsletterSubs, error: subsError } = await supabase
    .from('newsletter_subscribers')
    .select('email, first_name, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  if (usersError || subsError) {
    console.error('Error:', usersError || subsError)
    return
  }
  
  // Combine and deduplicate emails
  const allEmails = new Map()
  
  // Add users first
  if (users) {
    users.forEach(user => {
      allEmails.set(user.email, {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      })
    })
  }
  
  // Add newsletter subscribers (will update if email already exists)
  if (newsletterSubs) {
    newsletterSubs.forEach(sub => {
      if (!allEmails.has(sub.email)) {
        allEmails.set(sub.email, {
          email: sub.email,
          first_name: sub.first_name,
          last_name: '',
          created_at: sub.created_at
        })
      }
    })
  }
  
  const uniqueSubscribers = Array.from(allEmails.values())
  
  if (uniqueSubscribers.length === 0) {
    console.log('No subscribers found')
    return
  }
  
  console.log(`Found ${uniqueSubscribers.length} total unique subscribers (${users?.length || 0} users + ${newsletterSubs?.length || 0} newsletter subscribers)`)
  
  // Create CSV content
  const csvHeader = 'email,first_name,last_name,signup_date\n'
  const csvContent = uniqueSubscribers.map(sub => 
    `${sub.email},${sub.first_name || ''},${sub.last_name || ''},${new Date(sub.created_at).toLocaleDateString()}`
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
  
  // Get new users from this week
  const { data: newUsers, error: usersError } = await supabase
    .from('users')
    .select('email, first_name, last_name, created_at')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('created_at', { ascending: false })
  
  // Get new newsletter subscribers from this week
  const { data: newSubs, error: subsError } = await supabase
    .from('newsletter_subscribers')
    .select('email, first_name, created_at')
    .eq('status', 'active')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('created_at', { ascending: false })
  
  if (usersError || subsError) {
    console.error('Error:', usersError || subsError)
    return
  }
  
  // Combine and deduplicate
  const allNewEmails = new Map()
  
  if (newUsers) {
    newUsers.forEach(user => {
      allNewEmails.set(user.email, {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      })
    })
  }
  
  if (newSubs) {
    newSubs.forEach(sub => {
      if (!allNewEmails.has(sub.email)) {
        allNewEmails.set(sub.email, {
          email: sub.email,
          first_name: sub.first_name,
          last_name: '',
          created_at: sub.created_at
        })
      }
    })
  }
  
  const uniqueNewSubscribers = Array.from(allNewEmails.values())
  
  if (uniqueNewSubscribers.length === 0) {
    console.log('No new subscribers this week')
    return
  }
  
  console.log(`Found ${uniqueNewSubscribers.length} new subscribers this week:`)
  uniqueNewSubscribers.forEach(sub => {
    console.log(`- ${sub.email} (${new Date(sub.created_at).toLocaleDateString()})`)
  })
  
  // Create CSV for weekly signups
  const csvHeader = 'email,first_name,last_name,signup_date\n'
  const csvContent = uniqueNewSubscribers.map(sub => 
    `${sub.email},${sub.first_name || ''},${sub.last_name || ''},${new Date(sub.created_at).toLocaleDateString()}`
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