-- =====================================================
-- Royal Gems Institute - Supabase Database Schema
-- Migration from MongoDB - Step 3
-- =====================================================

-- Drop existing tables if they exist (to resolve conflicts)
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "gems" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" text UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "first_name" text,
  "last_name" text,
  "phone" text,
  "role" text NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin', 'admin', 'moderator', 'user')),
  "is_active" boolean NOT NULL DEFAULT true,
  "is_verified" boolean NOT NULL DEFAULT false,
  "two_factor_enabled" boolean NOT NULL DEFAULT false,
  "two_factor_secret" text,
  "last_login" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create gems table
CREATE TABLE "gems" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "description" text,
  "price" numeric(10,2) NOT NULL CHECK (price >= 0),
  "category" text NOT NULL,
  "carat_weight" numeric(5,2),
  "color" text,
  "clarity" text,
  "cut" text,
  "origin" text,
  "certification" text,
  "images" text[],
  "stock_quantity" integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create orders table
CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "status" text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  "total_amount" numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  "shipping_address" jsonb,
  "billing_address" jsonb,
  "payment_method" text,
  "payment_status" text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  "tracking_number" text,
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create order_items table
CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_id" uuid NOT NULL,
  "gem_id" uuid NOT NULL,
  "quantity" integer NOT NULL CHECK (quantity > 0),
  "unit_price" numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  "total_price" numeric(10,2) NOT NULL CHECK (total_price >= 0),
  "created_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create audit_logs table
CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "action" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" uuid,
  "old_values" jsonb,
  "new_values" jsonb,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add foreign key constraints
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_gem_id_fkey" FOREIGN KEY ("gem_id") REFERENCES "gems"("id") ON DELETE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON "users"
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON "users"
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON "users"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update users" ON "users"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin')
    )
  );

-- Create policies for gems table
CREATE POLICY "Anyone can view active gems" ON "gems"
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage gems" ON "gems"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin', 'moderator')
    )
  );

-- Create policies for orders table
CREATE POLICY "Users can view their own orders" ON "orders"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON "orders"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders" ON "orders"
  FOR UPDATE USING (
    auth.uid() = user_id
    AND status = 'pending'
  );

CREATE POLICY "Admins can view all orders" ON "orders"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update orders" ON "orders"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin')
    )
  );

-- Create policies for order_items table
CREATE POLICY "Users can view their own order items" ON "order_items"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON "order_items"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage order items" ON "order_items"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin', 'moderator')
    )
  );

-- Create policies for audit_logs table
CREATE POLICY "Admins can view audit logs" ON "audit_logs"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "gems_category_idx" ON "gems" ("category");
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders" ("user_id");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items" ("order_id");
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_type_idx" ON "audit_logs" ("entity_type");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gems_updated_at
  BEFORE UPDATE ON "gems"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON "orders"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();