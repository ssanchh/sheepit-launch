import { getSubscriberStatus } from '../lib/newsletter/beehiiv'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkStatus() {
  const email = 'ssanchezgoni01@gmail.com'
  const status = await getSubscriberStatus(email)
  console.log(`Status for ${email}:`, status)
}

checkStatus()
EOF && tsx scripts/check-beehiiv.ts < /dev/null