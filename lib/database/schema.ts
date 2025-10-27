import { SupabaseClient } from '@supabase/supabase-js'

export async function createSchema(supabase: SupabaseClient) {
  // These functions will help us manage our schema programmatically if needed
  const schemas = {
    users: `
      id uuid references auth.users primary key,
      email text unique not null,
      password text not null,
      first_name text not null,
      last_name text not null,
      role text default 'User' check (role in ('SuperAdmin', 'Admin', 'Moderator', 'User')),
      is_active boolean default true,
      two_factor_secret text,
      two_factor_enabled boolean default false,
      password_reset_token text,
      password_reset_expires timestamp with time zone,
      last_login timestamp with time zone,
      login_attempts integer default 0,
      lock_until timestamp with time zone,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      updated_at timestamp with time zone default timezone('utc'::text, now())
    `,
    gems: `
      id uuid default uuid_generate_v4() primary key,
      name text not null,
      description text not null,
      category text not null check (category in ('Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Other')),
      price decimal(10,2) not null check (price >= 0),
      images text[] not null default '{}',
      specifications jsonb default '{}',
      is_active boolean default true,
      seller_id uuid references users(id),
      approved_by uuid references users(id),
      approval_status text default 'Pending' check (approval_status in ('Pending', 'Approved', 'Rejected')),
      stock integer not null default 1 check (stock >= 0),
      created_at timestamp with time zone default timezone('utc'::text, now()),
      updated_at timestamp with time zone default timezone('utc'::text, now())
    `,
    orders: `
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references users(id),
      total_amount decimal(10,2) not null check (total_amount >= 0),
      status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      billing_details jsonb not null,
      payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
      payment_id text,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      updated_at timestamp with time zone default timezone('utc'::text, now())
    `,
    order_items: `
      id uuid default uuid_generate_v4() primary key,
      order_id uuid references orders(id) on delete cascade not null,
      product_id uuid references gems(id) not null,
      quantity integer not null check (quantity > 0),
      price decimal(10,2) not null check (price >= 0),
      product_details jsonb,
      created_at timestamp with time zone default timezone('utc'::text, now())
    `,
    audit_logs: `
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references users(id),
      action text not null,
      entity_type text not null,
      entity_id uuid not null,
      changes jsonb,
      created_at timestamp with time zone default timezone('utc'::text, now())
    `
  }

  return schemas
}