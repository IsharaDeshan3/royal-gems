import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createSchema } from './schema'
import { createPolicies } from './policies'

export async function setupDatabase(supabaseClient?: SupabaseClient) {
  // Create a Supabase client with service role key for admin operations
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  const supabase = supabaseClient || createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    }
  )

  try {
    // Get schemas and policies
    const schemas = await createSchema(supabase)
    const policies = await createPolicies(supabase)

    // Build complete SQL for database setup
    const sql = `
      -- Enable UUID extension
      create extension if not exists "uuid-ossp";

      -- Create tables
      ${Object.entries(schemas)
        .map(([table, schema]) => `
          create table if not exists "${table}" (
            ${schema}
          );
          
          -- Enable RLS
          alter table "${table}" enable row level security;
        `)
        .join('\n')}

      -- Create policies
      ${Object.entries(policies)
        .map(([table, tablePolicies]) =>
          tablePolicies
            .map(
              (policy) => `
                create policy "${policy.name}"
                on "${table}"
                for ${policy.operation}
                using (${policy.expression});
              `
            )
            .join('\n')
        )
        .join('\n')}

      -- Create indexes
      create index if not exists "gems_category_idx" on "gems" ("category");
      create index if not exists "orders_user_id_idx" on "orders" ("user_id");
      create index if not exists "orders_status_idx" on "orders" ("status");
      create index if not exists "order_items_order_id_idx" on "order_items" ("order_id");
      create index if not exists "audit_logs_user_id_idx" on "audit_logs" ("user_id");
      create index if not exists "audit_logs_entity_type_idx" on "audit_logs" ("entity_type");

      -- Create updated_at trigger function
      create or replace function update_updated_at_column()
      returns trigger as $$
      begin
        new.updated_at = timezone('utc'::text, now());
        return new;
      end;
      $$ language plpgsql;

      -- Add triggers
      create trigger update_users_updated_at
        before update on "users"
        for each row
        execute function update_updated_at_column();

      create trigger update_gems_updated_at
        before update on "gems"
        for each row
        execute function update_updated_at_column();

      create trigger update_orders_updated_at
        before update on "orders"
        for each row
        execute function update_updated_at_column();
    `

    // Split the SQL into separate statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    for (const statement of statements) {
      const { error } = await supabase
        .from('_raw')
        .select('*')
        .eq('query', statement)
      
      if (error) {
        console.error('Error executing:', statement)
        throw error
      }
    }

    console.log('Database setup completed successfully')
    return true
  } catch (error) {
    console.error('Error setting up database:', error)
    return false
  }
}