// Beehiiv integration - Manual export only
// Automatic sync has been removed in favor of weekly manual export
// Use scripts/export-emails-for-newsletter.ts for weekly exports

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2'

function getBeehiivConfig() {
  return {
    apiKey: process.env.BEEHIIV_API_KEY!,
    publicationId: process.env.BEEHIIV_PUBLICATION_ID!
  }
}

// Get subscriber status from Beehiiv (kept for potential future use)
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