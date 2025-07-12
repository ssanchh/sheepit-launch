import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function testDirectAPI() {
  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  
  console.log('Testing direct Beehiiv API call...')
  console.log('API Key length:', apiKey?.length)
  console.log('Publication ID:', pubId)
  
  try {
    // Test API key by getting publication info
    const response = await fetch(`https://api.beehiiv.com/v2/publications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testDirectAPI()