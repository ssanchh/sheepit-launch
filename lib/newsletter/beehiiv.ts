import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createBrowserClient } from '@/utils/supabase/client'

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2'

function getBeehiivConfig() {
  return {
    apiKey: process.env.BEEHIIV_API_KEY!,
    publicationId: process.env.BEEHIIV_PUBLICATION_ID!
  }
}

interface BeehiivSubscriber {
  email: string
  reactivate_existing?: boolean
  send_welcome_email?: boolean
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referring_site?: string
  custom_fields?: Array<{
    name: string
    value: string
  }>
}

interface BeehiivResponse {
  data: {
    id: string
    email: string
    status: string
    created: string
    subscription_tier: string
  }
}

export async function subscribeToNewsletter(
  email: string,
  userId?: string,
  source: string = 'website'
): Promise<{ success: boolean; subscriberId?: string; error?: string }> {
  try {
    const subscriberData: BeehiivSubscriber = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: source,
      utm_medium: 'organic',
      utm_campaign: 'website_signup',
      referring_site: 'sheepit.io',
    }

    // Add user ID as custom field if available
    if (userId) {
      subscriberData.custom_fields = [
        {
          name: 'user_id',
          value: userId,
        },
      ]
    }

    const config = getBeehiivConfig()
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${config.publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(subscriberData),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Beehiiv subscription error:', errorData)
      return { 
        success: false, 
        error: errorData.message || 'Failed to subscribe to newsletter' 
      }
    }

    const data: BeehiivResponse = await response.json()

    // Update our database with the Beehiiv subscriber ID
    if (data.data.id) {
      try {
        const supabase = typeof window === 'undefined' ? createServerClient() : createBrowserClient()
        await supabase
          .from('newsletter_subscribers')
          .update({
            beehiiv_subscriber_id: data.data.id,
            status: 'active',
            subscribed_at: new Date().toISOString(),
          })
          .eq('email', email)
      } catch (dbError) {
        // Log but don't fail if database update fails
        console.log('Database update skipped:', dbError)
      }
    }

    return { success: true, subscriberId: data.data.id }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getBeehiivConfig()
    // First get the subscriber ID from Beehiiv
    const searchResponse = await fetch(
      `${BEEHIIV_API_URL}/publications/${config.publicationId}/subscriptions?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    )

    if (!searchResponse.ok) {
      return { success: false, error: 'Subscriber not found' }
    }

    const searchData = await searchResponse.json()
    const subscriber = searchData.data?.[0]

    if (!subscriber) {
      return { success: false, error: 'Subscriber not found' }
    }

    // Unsubscribe the user
    const unsubscribeResponse = await fetch(
      `${BEEHIIV_API_URL}/publications/${config.publicationId}/subscriptions/${subscriber.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    )

    if (!unsubscribeResponse.ok) {
      const errorData = await unsubscribeResponse.json()
      return { 
        success: false, 
        error: errorData.message || 'Failed to unsubscribe' 
      }
    }

    // Update our database
    const supabase = createClient()
    await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)

    return { success: true }
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Function to sync existing users to Beehiiv
export async function syncExistingSubscribers() {
  const supabase = createClient()
  
  // Get all active newsletter subscribers without Beehiiv ID
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('email, user_id')
    .eq('status', 'active')
    .is('beehiiv_subscriber_id', null)

  if (error || !subscribers) {
    console.error('Error fetching subscribers:', error)
    return
  }

  console.log(`Syncing ${subscribers.length} subscribers to Beehiiv...`)

  for (const subscriber of subscribers) {
    const result = await subscribeToNewsletter(
      subscriber.email,
      subscriber.user_id,
      'sync'
    )
    
    if (result.success) {
      console.log(`✓ Synced ${subscriber.email}`)
    } else {
      console.error(`✗ Failed to sync ${subscriber.email}:`, result.error)
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('Sync complete!')
}

// Get subscriber status from Beehiiv
export async function getSubscriberStatus(email: string): Promise<{
  subscribed: boolean
  status?: string
  tier?: string
}> {
  try {
    const config = getBeehiivConfig()
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${config.publicationId}/subscriptions?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      return { subscribed: false }
    }

    const data = await response.json()
    const subscriber = data.data?.[0]

    if (!subscriber) {
      return { subscribed: false }
    }

    return {
      subscribed: subscriber.status === 'active',
      status: subscriber.status,
      tier: subscriber.subscription_tier,
    }
  } catch (error) {
    console.error('Error checking subscriber status:', error)
    return { subscribed: false }
  }
}