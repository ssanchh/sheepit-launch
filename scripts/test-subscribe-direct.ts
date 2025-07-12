import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function testSubscribe() {
  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  
  console.log('Testing subscription...')
  
  const subscriberData = {
    email: 'test@example.com',
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: 'api_test',
    utm_medium: 'api',
    referring_site: 'sheepit.io'
  }
  
  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriberData)
      }
    )
    
    console.log('Status:', response.status)
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testSubscribe()