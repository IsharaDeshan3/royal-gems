# Supabase Configuration Steps

## ✅ STEP 1: Remove RLS Policies (CRITICAL)

**You MUST run this SQL in Supabase Dashboard:**

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your project: `xtqwqrnongwhiukntlkn`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy ALL the contents from `REMOVE_ALL_SECURITY.sql`
6. Paste into the query editor
7. Click **Run** (or press Ctrl+Enter)

**Why?** The infinite recursion error happens because RLS policies try to query the users table while protecting it, creating an infinite loop.

---

## ✅ STEP 2: Verify Database Schema

Make sure these tables exist with the correct columns:

### `users` table
```sql
- id (uuid, primary key)
- email (text)
- password (text) -- Note: NOT password_hash
- first_name (text)
- last_name (text)
- role (text) -- Values: 'Admin', 'Moderator', 'User' (capitalized)
- is_active (boolean)
- two_factor_enabled (boolean)
- two_factor_secret (text, nullable)
- password_reset_token (text, nullable)
- password_reset_expires (timestamp, nullable)
- last_login (timestamp, nullable)
- login_attempts (integer)
- lock_until (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### `gems` table
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- category (text)
- carat_weight (numeric, nullable)
- color (text, nullable)
- clarity (text, nullable)
- cut (text, nullable)
- origin (text, nullable)
- certification (text, nullable)
- images (jsonb)
- stock_quantity (integer)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### `orders` table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → users)
- status (text)
- total_amount (numeric)
- payment_method (text, nullable)
- shipping_address (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

### `audit_logs` table
```sql
- id (uuid, primary key)
- user_id (uuid, nullable, foreign key → users)
- action (text)
- resource_type (text)
- resource_id (uuid, nullable)
- details (jsonb, nullable)
- ip_address (text)
- user_agent (text)
- created_at (timestamp)
```

---

## ✅ STEP 3: Verify Admin User Exists

Run this query to check:

```sql
SELECT id, email, role, is_active FROM users WHERE email = 'admin123@gmail.com';
```

**Expected result:**
- email: `admin123@gmail.com`
- role: `Admin` (capitalized)
- is_active: `true`

If the user doesn't exist or role is wrong, run:

```sql
-- If user exists but role is wrong
UPDATE users 
SET role = 'Admin', is_active = true 
WHERE email = 'admin123@gmail.com';

-- If user doesn't exist, you need to create it via Supabase Auth first
-- Then add the profile
```

---

## ✅ STEP 4: Enable Realtime (Optional)

If you want realtime updates for admin dashboard:

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `users`
   - `gems`
   - `orders`
   - `audit_logs`

---

## ⚠️ IMPORTANT NOTES

1. **RLS is DISABLED** - All authorization is now handled in the backend code
2. **Use Service Role Key carefully** - It bypasses all security
3. **Admin user credentials:**
   - Email: `admin123@gmail.com`
   - Password: `#Ishara12600k`
4. **Session cookies** are managed by Supabase SSR client
5. **CSRF protection** is currently disabled (TODOs in code)

---

## 🔧 After Running SQL

1. **Restart your dev server**: Stop (`Ctrl+C`) and run `npm run dev` again
2. **Clear browser cookies**: Open DevTools → Application → Cookies → Clear
3. **Try logging in**: Go to http://localhost:3001/admin/login
4. **Check console**: Look for any errors in browser and server logs

---

## 🐛 Troubleshooting

If login still fails after running SQL:

### Check 1: Verify RLS is disabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
All should show `rowsecurity = false`

### Check 2: Verify policies are dropped
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```
Should return 0 rows

### Check 3: Test direct auth
```sql
SELECT * FROM auth.users WHERE email = 'admin123@gmail.com';
```
Should return the user

---

## 📝 Environment Variables

Make sure `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xtqwqrnongwhiukntlkn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

---

## ✅ Success Checklist

- [ ] Ran `REMOVE_ALL_SECURITY.sql` in Supabase Dashboard
- [ ] Verified admin user exists with correct role
- [ ] Restarted dev server
- [ ] Cleared browser cookies
- [ ] Successfully logged in to `/admin/login`
- [ ] Can see admin dashboard
- [ ] Can navigate to Users, Gems pages

If all checked, your admin panel is ready! 🎉
