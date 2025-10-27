-- FIX FOR INFINITE RECURSION IN USERS TABLE POLICIES
-- The issue: Policies are checking the users table while querying the users table (infinite loop)

-- ===========================================
-- DISABLE RLS TEMPORARILY OR FIX POLICIES
-- ===========================================

-- Option 1: Disable RLS on users table (QUICK FIX for development)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: Fix the policies to avoid recursion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create NON-RECURSIVE policies
-- These policies use auth.uid() directly instead of querying users table

-- 1. Users can view their own profile (no recursion)
CREATE POLICY "users_select_own" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- 2. Users can update their own profile (no recursion)
CREATE POLICY "users_update_own" 
  ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 3. Service role can do everything (for backend operations)
CREATE POLICY "service_role_all" 
  ON users 
  FOR ALL 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Note: For admin access, use service role key from backend
-- Don't create policies that query users table to check admin role
-- That causes infinite recursion

-- ===========================================
-- QUICK FIX: Just disable RLS for development
-- ===========================================
-- If above doesn't work, just run this:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
