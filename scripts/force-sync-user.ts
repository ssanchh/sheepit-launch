import { subscribeToNewsletter } from '../lib/newsletter/beehiiv'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function forceSync() {
  console.log('Force syncing user to Beehiiv...')
  
  const result = await subscribeToNewsletter(
    'ssanchezgoni01@gmail.com',
    'bfd58a9d-3e7f-4de7-b798-bfbfcf27b8a1', // Your user ID from the database
    'manual_sync'
  )
  
  if (result.success) {
    console.log('✅ Successfully synced! Subscriber ID:', result.subscriberId)
  } else {
    console.log('❌ Failed:', result.error)
  }
}

forceSync()