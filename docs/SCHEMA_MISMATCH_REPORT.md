# SCHEMA MISMATCH ANALYSIS

## Problem Summary
Your Supabase database schema (actual) does NOT match your application code expectations.

### Actual Supabase Schema (from your SQL):
```sql
-- USERS TABLE
- id uuid references auth.users
- password (NOT password_hash)
- role values: 'SuperAdmin', 'Admin', 'Moderator', 'User' (capitalized)
- NO is_verified field
- Has: password_reset_token, password_reset_expires, login_attempts, lock_until

-- GEMS TABLE  
- Has: specifications jsonb
- Has: seller_id, approved_by, approval_status
- Has: stock (NOT stock_quantity)
- Category check: ('Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Other')
```

### Application Code Expects (lib/repositories):
```typescript
-- USERS
- password_hash (but actual has: password)
- is_verified (but actual schema DOESN'T have this)
- role: 'superadmin', 'admin', 'moderator', 'user' (lowercase)

-- GEMS
- Individual fields: carat_weight, color, clarity, cut, origin, certification  
- stock_quantity (but actual has: stock)
- NO specifications field
```

## Why Admin Login Fails (401)
1. ✅ User exists in Supabase Auth
2. ✅ User profile exists in users table  
3. ✅ Role is 'Admin' (capitalized)
4. ❌ Code might be trying to access `is_verified` which doesn't exist
5. ❌ Other field mismatches causing query failures

## Solution Options

### Option 1: Update Code to Match Actual Schema (RECOMMENDED)
- Modify User interface to match actual schema
- Update Gem interface to use specifications jsonb
- Fix all references to use actual field names

### Option 2: Recreate Database with Expected Schema
- Drop all tables
- Run the code's expected schema (supabase-schema.sql in project)
- Recreate admin user

## Immediate Fix for Admin Login

The User interface needs to match your actual schema. I've already updated it, but let's verify the login works now.

Run: `node scripts/test-login.js`

If still failing, we need to:
1. Remove `is_verified` references from code
2. Update all user-related queries
3. Consider using specifications jsonb for gems

