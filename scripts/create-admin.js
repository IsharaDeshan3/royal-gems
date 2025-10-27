/**
 * Script to create an admin user in Supabase
 * Run with: node scripts/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = '#Ishara12600k';

async function createAdminUser() {
  console.log('🚀 Starting admin user creation...\n');

  try {
    // Step 1: Check if user exists in Supabase Auth
    console.log('📧 Checking if user exists in Supabase Auth...');
    const { data: existingAuthUser } = await supabase.auth.admin.listUsers();
    const userExists = existingAuthUser?.users?.find(u => u.email === ADMIN_EMAIL);

    let userId;

    if (userExists) {
      console.log('✅ User already exists in Supabase Auth');
      userId = userExists.id;
    } else {
      // Create user in Supabase Auth
      console.log('📝 Creating user in Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User'
        }
      });

      if (authError) {
        throw new Error(`Auth creation failed: ${authError.message}`);
      }

      userId = authData.user.id;
      console.log('✅ User created in Supabase Auth');
    }

    // Step 2: Check if user profile exists in users table
    console.log('\n📊 Checking users table...');
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      throw new Error(`Profile check failed: ${profileCheckError.message}`);
    }

    if (existingProfile) {
      // Update existing profile
      console.log('📝 Updating existing user profile...');
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'Admin',
          is_active: true,
          first_name: 'Admin',
          last_name: 'User',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      console.log('✅ User profile updated with admin role');
    } else {
      // Create new profile matching actual schema
      console.log('📝 Creating user profile in users table...');
      
      // Match the actual schema: id, email, password, first_name, last_name, role, etc.
      const profileData = {
        id: userId,
        email: ADMIN_EMAIL,
        password: '', // Not used - handled by Supabase Auth
        first_name: 'Admin',
        last_name: 'User',
        role: 'Admin', // Capitalized to match schema
        is_active: true,
        two_factor_enabled: false,
        login_attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert(profileData);

      if (insertError) {
        // If insert fails, try to provide more context
        console.error('Insert error details:', insertError);
        throw new Error(`Profile creation failed: ${insertError.message}`);
      }

      console.log('✅ User profile created with admin role');
    }

    // Step 3: Verify the setup
    console.log('\n🔍 Verifying admin user setup...');
    const { data: finalProfile, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    console.log('\n✅ Admin user created successfully!\n');
    console.log('\n📋 User Details:');
    console.log('   ID:', finalProfile.id);
    console.log('   Email:', finalProfile.email);
    console.log('   Role:', finalProfile.role);
    console.log('   Active:', finalProfile.is_active);
    console.log('\n🔐 Login Credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('\n✨ You can now login to the admin panel!\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
