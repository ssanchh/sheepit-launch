import { subscribeToNewsletter } from '../lib/newsletter/beehiiv'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testBeehiiv() {
  console.log('Testing Beehiiv integration...')
  console.log('API Key:', process.env.BEEHIIV_API_KEY ? 'Set ✓' : 'Missing ✗')
  console.log('Publication ID:', process.env.BEEHIIV_PUBLICATION_ID ? 'Set ✓' : 'Missing ✗')
  
  const testEmail = 'test@sheepit.io'
  console.log(`\nSubscribing ${testEmail} to newsletter...`)
  
  const result = await subscribeToNewsletter(testEmail, 'test-user-id', 'test')
  
  if (result.success) {
    console.log('✅ Success! Subscriber ID:', result.subscriberId)
  } else {
    console.log('❌ Failed:', result.error)
  }
}

testBeehiiv()