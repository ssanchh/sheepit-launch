import { sendWelcomeEmail } from './lib/email/service'

async function testEmail() {
  console.log('Testing welcome email...')
  
  const result = await sendWelcomeEmail(
    'test@example.com',
    'test-user-id-123',
    'Test User'
  )
  
  console.log('Result:', result)
}

testEmail().catch(console.error)