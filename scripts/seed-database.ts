/**
 * Database Seeding Script
 * 
 * Seeds the Supabase database with test data for development and testing.
 * 
 * Usage: npx tsx scripts/seed-database.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedUsers() {
  console.log('👥 Seeding users...');

  const testUsers = [
    {
      email: 'admin@royalgems.com',
      password: 'Admin123!@#',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    },
    {
      email: 'customer@test.com',
      password: 'Customer123!@#',
      firstName: 'Test',
      lastName: 'Customer',
      role: 'customer'
    }
  ];

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName
        }
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: user.email,
        password: await bcrypt.hash(user.password, 12), // Hash the password
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role === 'admin' ? 'Admin' : 'User',
        is_active: true,
        two_factor_enabled: false,
        login_attempts: 0,
      });

      if (profileError) throw profileError;

      console.log(`✓ Created user: ${user.email} (${user.role})`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`- User already exists: ${user.email}`);
      } else {
        console.error(`✗ Failed to create user ${user.email}:`, error.message);
      }
    }
  }
}

async function seedGems() {
  console.log('\n💎 Seeding gems...');

  const testGems = [
    {
      name: 'Blue Sapphire',
      description: 'Premium quality natural blue sapphire certified by the Royal Gems Institute.',
      price: 1250.00,
      category: 'Sapphire' as const,
      images: ['https://example.com/sapphire.jpg'],
      stock: 15,
      is_active: true,
      specifications: {
        carat_weight: 2.5,
        color: 'Blue',
        clarity: 'VS',
        cut: 'Oval',
        origin: 'Sri Lanka',
        certification: 'RGI-2024-001'
      }
    },
    {
      name: 'Ruby Gemstone',
      description: 'Vivid red ruby with excellent clarity. Certified and graded by Royal Gems Institute.',
      price: 980.00,
      category: 'Ruby' as const,
      images: ['https://example.com/ruby.jpg'],
      stock: 20,
      is_active: true,
      specifications: {
        carat_weight: 1.8,
        color: 'Red',
        clarity: 'VVS',
        cut: 'Round',
        origin: 'Myanmar',
        certification: 'RGI-2024-002'
      }
    },
    {
      name: 'Emerald Gemstone',
      description: 'Natural green emerald gemstone – high-quality cut and finish.',
      price: 750.00,
      category: 'Emerald' as const,
      images: ['https://example.com/emerald.jpg'],
      stock: 12,
      is_active: true,
      specifications: {
        carat_weight: 3.0,
        color: 'Green',
        clarity: 'VS',
        cut: 'Emerald',
        origin: 'Colombia',
        certification: 'RGI-2024-003'
      }
    },
    {
      name: 'Pink Diamond',
      description: 'Rare fancy pink diamond with exceptional brilliance.',
      price: 5000.00,
      category: 'Diamond' as const,
      images: ['https://example.com/pink-diamond.jpg'],
      stock: 3,
      is_active: true,
      specifications: {
        carat_weight: 1.0,
        color: 'Pink',
        clarity: 'IF',
        cut: 'Cushion',
        origin: 'Australia',
        certification: 'RGI-2024-004'
      }
    }
  ];

  for (const gem of testGems) {
    try {
      const { error } = await supabase.from('gems').insert(gem);
      
      if (error) throw error;
      
      console.log(`✓ Created gem: ${gem.name}`);
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        console.log(`- Gem already exists: ${gem.name}`);
      } else {
        console.error(`✗ Failed to create gem ${gem.name}:`, error.message);
      }
    }
  }
}

async function seedOrders() {
  console.log('\n📋 Seeding orders...');

  // Get a test user
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'customer')
    .limit(1);

  if (!users || users.length === 0) {
    console.log('- No customer users found, skipping order seeding');
    return;
  }

  // Get some gems
  const { data: gems } = await supabase
    .from('gems')
    .select('id, name, price')
    .limit(2);

  if (!gems || gems.length === 0) {
    console.log('- No gems found, skipping order seeding');
    return;
  }

  const testOrders = [
    {
      user_id: users[0].id,
      items: gems.slice(0, 1).map(gem => ({
        gem_id: gem.id,
        gem_name: gem.name,
        quantity: 1,
        price: gem.price
      })),
      total_amount: gems[0].price,
      status: 'completed',
      payment_status: 'paid',
      payment_method: 'credit_card',
      shipping_address: {
        street: '123 Main St',
        city: 'Colombo',
        country: 'Sri Lanka',
        postal_code: '00100'
      }
    }
  ];

  for (const order of testOrders) {
    try {
      const { error } = await supabase.from('orders').insert(order);
      
      if (error) throw error;
      
      console.log(`✓ Created order with ${order.items.length} item(s)`);
    } catch (error: any) {
      console.error(`✗ Failed to create order:`, error.message);
    }
  }
}

async function runSeeding() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedUsers();
    await seedGems();
    await seedOrders();

    console.log('\n✅ Database seeding complete!');
    console.log('\nTest credentials:');
    console.log('- Admin: admin@royalgems.com / Admin123!@#');
    console.log('- Customer: customer@test.com / Customer123!@#');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeding();
