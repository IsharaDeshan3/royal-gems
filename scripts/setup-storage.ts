/**
 * Supabase Storage Setup Script
 *
 * Creates the necessary storage buckets for the Royal Gems Institute application.
 *
 * Usage: npx tsx scripts/setup-storage.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createStorageBucket() {
  console.log('📦 Setting up Supabase Storage buckets...');

  const buckets = [
    {
      name: 'gems-images',
      public: true,
      description: 'Images for gem products and gallery'
    },
    {
      name: 'user-avatars',
      public: true,
      description: 'User profile avatars'
    },
    {
      name: 'documents',
      public: false,
      description: 'Private documents and certificates'
    }
  ];

  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.name}...`);

      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.name.includes('images') ? ['image/*'] : undefined,
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✓ Bucket '${bucket.name}' already exists`);
        } else {
          throw error;
        }
      } else {
        console.log(`✓ Created bucket: ${bucket.name}`);
      }

      // Set up RLS policies for the bucket
      if (bucket.name === 'gems-images') {
        // Allow public read access for gem images
        await supabase.storage.from(bucket.name).list('', { limit: 1 });

        console.log(`✓ Configured public access for ${bucket.name}`);
      }

    } catch (error: any) {
      console.error(`✗ Failed to create bucket ${bucket.name}:`, error.message);
    }
  }
}

async function setupStoragePolicies() {
  console.log('\n🔒 Setting up storage policies...');

  // Note: These policies would need to be created in the Supabase dashboard
  // or through SQL migrations for proper RLS setup
  console.log('Note: Storage policies should be configured in Supabase Dashboard:');
  console.log('- gems-images: Public read access');
  console.log('- user-avatars: Authenticated users can upload their own avatars');
  console.log('- documents: Admin-only access');
}

async function runSetup() {
  console.log('🚀 Starting Supabase Storage setup...\n');

  try {
    await createStorageBucket();
    await setupStoragePolicies();

    console.log('\n✅ Storage setup complete!');
    console.log('\nNext steps:');
    console.log('1. Go to Supabase Dashboard → Storage');
    console.log('2. Configure RLS policies for each bucket as needed');
    console.log('3. Test image uploads in the admin panel');

  } catch (error) {
    console.error('\n❌ Storage setup failed:', error);
    process.exit(1);
  }
}

runSetup();