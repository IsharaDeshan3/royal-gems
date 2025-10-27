/**
 * Data Migration Script: MongoDB to Supabase
 * 
 * This script migrates data from MongoDB to Supabase PostgreSQL.
 * Since there's no production data to migrate, this serves as a reference
 * for future migrations if needed.
 * 
 * Usage: npx tsx scripts/migrate-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

interface MigrationStats {
  users: { total: number; success: number; failed: number };
  gems: { total: number; success: number; failed: number };
  orders: { total: number; success: number; failed: number };
}

async function migrateUsers(mongoUsers: any[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const mongoUser of mongoUsers) {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: mongoUser.email,
        password: Math.random().toString(36).slice(-12), // Generate random password
        email_confirm: true,
        user_metadata: {
          first_name: mongoUser.firstName,
          last_name: mongoUser.lastName,
          phone: mongoUser.phone
        }
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: mongoUser.email,
        first_name: mongoUser.firstName,
        last_name: mongoUser.lastName,
        phone: mongoUser.phone,
        role: mongoUser.role || 'customer',
        is_active: mongoUser.isActive !== false,
        is_verified: mongoUser.isVerified || false,
        two_factor_enabled: mongoUser.twoFactorEnabled || false,
        two_factor_secret: mongoUser.twoFactorSecret,
        created_at: mongoUser.createdAt || new Date().toISOString(),
      });

      if (profileError) throw profileError;
      
      success++;
      console.log(`✓ Migrated user: ${mongoUser.email}`);
    } catch (error) {
      failed++;
      console.error(`✗ Failed to migrate user ${mongoUser.email}:`, error);
    }
  }

  return { success, failed };
}

async function migrateGems(mongoGems: any[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const mongoGem of mongoGems) {
    try {
      const { error } = await supabase.from('gems').insert({
        name: mongoGem.name,
        description: mongoGem.description,
        price: mongoGem.price,
        category: mongoGem.category,
        carat_weight: mongoGem.caratWeight,
        color: mongoGem.color,
        clarity: mongoGem.clarity,
        cut: mongoGem.cut,
        origin: mongoGem.origin,
        certification: mongoGem.certification,
        images: mongoGem.images || [],
        stock_quantity: mongoGem.stock || mongoGem.stockQuantity || 0,
        is_active: mongoGem.isActive !== false,
        created_at: mongoGem.createdAt || new Date().toISOString(),
      });

      if (error) throw error;
      
      success++;
      console.log(`✓ Migrated gem: ${mongoGem.name}`);
    } catch (error) {
      failed++;
      console.error(`✗ Failed to migrate gem ${mongoGem.name}:`, error);
    }
  }

  return { success, failed };
}

async function migrateOrders(mongoOrders: any[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const mongoOrder of mongoOrders) {
    try {
      const { error } = await supabase.from('orders').insert({
        user_id: mongoOrder.userId,
        items: mongoOrder.items,
        total_amount: mongoOrder.totalAmount || mongoOrder.total,
        status: mongoOrder.status || 'pending',
        payment_status: mongoOrder.paymentStatus || 'pending',
        payment_method: mongoOrder.paymentMethod,
        shipping_address: mongoOrder.shippingAddress,
        tracking_number: mongoOrder.trackingNumber,
        notes: mongoOrder.notes,
        created_at: mongoOrder.createdAt || new Date().toISOString(),
      });

      if (error) throw error;
      
      success++;
      console.log(`✓ Migrated order: ${mongoOrder._id || mongoOrder.id}`);
    } catch (error) {
      failed++;
      console.error(`✗ Failed to migrate order:`, error);
    }
  }

  return { success, failed };
}

async function runMigration() {
  console.log('🚀 Starting data migration from MongoDB to Supabase...\n');

  const stats: MigrationStats = {
    users: { total: 0, success: 0, failed: 0 },
    gems: { total: 0, success: 0, failed: 0 },
    orders: { total: 0, success: 0, failed: 0 },
  };

  // Since there's no MongoDB data, this is just a template
  const mongoUsers: any[] = [];
  const mongoGems: any[] = [];
  const mongoOrders: any[] = [];

  // Migrate Users
  console.log('📦 Migrating users...');
  stats.users.total = mongoUsers.length;
  if (mongoUsers.length > 0) {
    const userResult = await migrateUsers(mongoUsers);
    stats.users.success = userResult.success;
    stats.users.failed = userResult.failed;
  }
  console.log(`Users: ${stats.users.success}/${stats.users.total} migrated\n`);

  // Migrate Gems
  console.log('💎 Migrating gems...');
  stats.gems.total = mongoGems.length;
  if (mongoGems.length > 0) {
    const gemResult = await migrateGems(mongoGems);
    stats.gems.success = gemResult.success;
    stats.gems.failed = gemResult.failed;
  }
  console.log(`Gems: ${stats.gems.success}/${stats.gems.total} migrated\n`);

  // Migrate Orders
  console.log('📋 Migrating orders...');
  stats.orders.total = mongoOrders.length;
  if (mongoOrders.length > 0) {
    const orderResult = await migrateOrders(mongoOrders);
    stats.orders.success = orderResult.success;
    stats.orders.failed = orderResult.failed;
  }
  console.log(`Orders: ${stats.orders.success}/${stats.orders.total} migrated\n`);

  // Summary
  console.log('✅ Migration Complete!\n');
  console.log('Summary:');
  console.log(`- Users: ${stats.users.success} success, ${stats.users.failed} failed`);
  console.log(`- Gems: ${stats.gems.success} success, ${stats.gems.failed} failed`);
  console.log(`- Orders: ${stats.orders.success} success, ${stats.orders.failed} failed`);
  console.log(`\nTotal: ${stats.users.success + stats.gems.success + stats.orders.success} records migrated`);
}

// Run migration
runMigration().catch(console.error);
