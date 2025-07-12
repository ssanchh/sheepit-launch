import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY!
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID!

async function subscribeToBeehiiv(email: string, userId?: string, firstName?: string) {
  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
          utm_source: 'signup',
          utm_medium: 'organic',
          custom_fields: [
            {
              name: 'user_id',
              value: userId || ''
            },
            {
              name: 'first_name',
              value: firstName || ''
            }
          ]
        })
      }
    )

    const result = await response.json()
    
    if (response.ok && result.data) {
      return { success: true, subscriberId: result.data.id }
    } else {
      console.error(`Failed to subscribe ${email}:`, result)
      return { success: false, error: result.message || 'Unknown error' }
    }
  } catch (error) {
    console.error(`Error subscribing ${email}:`, error)
    return { success: false, error: error.message }
  }
}

async function processPendingSubscriptions() {
  console.log('Processing pending newsletter subscriptions...\n')
  
  // Get all pending subscriptions
  const { data: pending, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching pending subscriptions:', error)
    return
  }
  
  if (!pending || pending.length === 0) {
    console.log('No pending subscriptions to process')
    return
  }
  
  console.log(`Found ${pending.length} pending subscriptions to process\n`)
  
  let successCount = 0
  let failCount = 0
  
  for (const subscriber of pending) {
    console.log(`Processing ${subscriber.email}...`)
    
    const result = await subscribeToBeehiiv(
      subscriber.email,
      subscriber.user_id,
      subscriber.first_name
    )
    
    if (result.success) {
      // Update status to active
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          beehiiv_subscriber_id: result.subscriberId,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriber.id)
      
      if (updateError) {
        console.error(`Failed to update status for ${subscriber.email}:`, updateError)
      } else {
        console.log(`✓ Successfully subscribed ${subscriber.email}`)
        successCount++
      }
    } else {
      // Update status to failed
      await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriber.id)
      
      console.log(`✗ Failed to subscribe ${subscriber.email}: ${result.error}`)
      failCount++
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log(`\nProcessing complete:`)
  console.log(`- Successful: ${successCount}`)
  console.log(`- Failed: ${failCount}`)
  console.log(`- Total: ${pending.length}`)
}

// Run the script
processPendingSubscriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })