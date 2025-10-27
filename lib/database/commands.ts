import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { setupDatabase } from './setup'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function main() {
  console.log('Starting database setup...')

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  // Create Supabase client with service role key for admin operations
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    }
  )

  try {
    const success = await setupDatabase(supabase)
    if (success) {
      console.log('Database setup completed successfully!')
    } else {
      console.error('Database setup failed!')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error during database setup:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}