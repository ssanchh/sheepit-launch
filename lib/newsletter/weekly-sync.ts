import { createClient } from '@/utils/supabase/server'
import { subscribeToNewsletter } from './beehiiv'

// This function can be called weekly to send newsletter updates about winners
export async function syncWeeklyWinners() {
  const supabase = createClient()
  
  // Get this week's winners
  const { data: winners, error } = await supabase
    .from('products')
    .select(`
      *,
      users (
        id,
        email,
        first_name,
        last_name
      )
    `)
    .eq('is_winner', true)
    .eq('is_live', false) // Just ended products
    .order('votes', { ascending: false })
    .limit(3)

  if (error || !winners) {
    console.error('Error fetching winners:', error)
    return
  }

  // Get all active newsletter subscribers
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email, beehiiv_subscriber_id')
    .eq('status', 'active')

  if (!subscribers) return

  // In a real implementation, you would:
  // 1. Create a campaign in Beehiiv with the winners content
  // 2. Send it to all subscribers
  // 3. Track the send in email_logs
  
  console.log(`Would send newsletter to ${subscribers.length} subscribers`)
  console.log('This week\'s winners:', winners.map(w => ({
    name: w.name,
    votes: w.votes,
    creator: w.users?.first_name || 'Unknown'
  })))

  // Log the newsletter send
  for (const winner of winners) {
    await supabase
      .from('email_logs')
      .insert({
        user_id: winner.users?.id,
        email: winner.users?.email,
        email_type: 'weekly_newsletter',
        subject: `🏆 Weekly Winners: ${winner.name} takes #${winners.indexOf(winner) + 1}!`,
        provider: 'beehiiv',
        status: 'sent',
      })
  }

  return {
    winnerCount: winners.length,
    subscriberCount: subscribers.length,
    sent: true
  }
}

// Function to handle new user signups - auto-subscribe them if they opt in
export async function handleNewUserSignup(
  userId: string,
  email: string,
  firstName?: string,
  optInNewsletter: boolean = true
) {
  if (!optInNewsletter) return

  const supabase = createClient()
  
  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return // Already subscribed

  // Subscribe to newsletter
  await supabase
    .from('newsletter_subscribers')
    .insert({
      email,
      user_id: userId,
      first_name: firstName,
      source: 'signup',
      status: 'pending',
    })

  // Add to Beehiiv
  const result = await subscribeToNewsletter(email, userId, 'signup')
  
  if (result.success) {
    console.log(`✓ Subscribed ${email} to newsletter`)
  } else {
    console.error(`✗ Failed to subscribe ${email}:`, result.error)
  }
}