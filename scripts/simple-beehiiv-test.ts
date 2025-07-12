import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function simpleTest() {
  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  
  console.log('Simple Beehiiv test...')
  
  const subscriberData = {
    email: 'ssanchezgoni01@gmail.com',
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: 'sheepit',
    utm_medium: 'website',
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
    
    if (response.ok) {
      console.log('✅ Success! Subscriber ID:', data.data.id)
      console.log('Email:', data.data.email)
      console.log('Status:', data.data.status)
    } else {
      console.log('❌ Error:', data)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

simpleTest()