#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { subscribeToNewsletter } from '../lib/newsletter/beehiiv'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
  console.error('Missing Beehiiv environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncUsersToNewsletter() {
  console.log('Starting newsletter sync...')
  
  try {
    // Get all users who have completed their profile
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, profile_completed')
      .eq('profile_completed', true)
    
    if (error) {
      console.error('Error fetching users:', error)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('No users to sync')
      return
    }
    
    console.log(`Found ${users.length} users to sync`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const user of users) {
      // Check if already in newsletter_subscribers table
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', user.email)
        .single()
      
      if (existing) {
        console.log(`⏭️  Skipping ${user.email} - already in database`)
        continue
      }
      
      // Add to newsletter_subscribers table first
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: user.email,
          user_id: user.id,
          status: 'active',
          source: 'profile_sync'
        })
      
      if (insertError) {
        console.error(`❌ Failed to add ${user.email} to database:`, insertError)
        errorCount++
        continue
      }
      
      // Subscribe to Beehiiv
      const result = await subscribeToNewsletter(
        user.email,
        user.id,
        'profile_sync'
      )
      
      if (result.success) {
        console.log(`✅ Synced ${user.email}`)
        successCount++
      } else {
        console.error(`❌ Failed to sync ${user.email}:`, result.error)
        errorCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('\n📊 Sync Summary:')
    console.log(`✅ Successfully synced: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log(`⏭️  Skipped: ${users.length - successCount - errorCount}`)
    
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

// Run the sync
syncUsersToNewsletter()
  .then(() => {
    console.log('\n✨ Sync complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })