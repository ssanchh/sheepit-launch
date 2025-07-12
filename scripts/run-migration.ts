import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function runMigration() {
  try {
    const migrationPath = join(process.cwd(), 'supabase/migrations/006_auto_newsletter_signup.sql')
    const sql = readFileSync(migrationPath, 'utf-8')
    
    console.log('Running migration: 006_auto_newsletter_signup.sql\n')
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      // Try running it directly
      const statements = sql.split(';').filter(s => s.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.substring(0, 50) + '...')
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })
          if (error) {
            console.error('Error:', error)
          }
        }
      }
    }
    
    console.log('\nMigration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()