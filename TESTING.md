# Testing Guide

## Manual Testing Checklist

### ✅ Step 7: Testing & Validation

#### 1. Authentication Testing

**Sign Up:**
- [ ] Navigate to signup page
- [ ] Create new user with valid email/password
- [ ] Verify email confirmation sent
- [ ] Check user created in Supabase Auth
- [ ] Check user profile created in `users` table

**Login:**
- [ ] Login with correct credentials ✓
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Verify session created
- [ ] Verify access token received

**2FA:**
- [ ] Enable 2FA for user
- [ ] Verify QR code generated
- [ ] Test 2FA verification
- [ ] Login with 2FA enabled

**Password Reset:**
- [ ] Request password reset
- [ ] Receive reset email
- [ ] Reset password with token
- [ ] Login with new password

#### 2. Admin Panel Testing

**Admin Login:**
- [ ] Login as admin user
- [ ] Verify redirect to admin dashboard
- [ ] Check admin role enforcement

**User Management:**
- [ ] View all users
- [ ] Search users
- [ ] Create new user
- [ ] Update user role
- [ ] Deactivate user
- [ ] Activate user
- [ ] Delete user

**Gem Management:**
- [ ] View all gems
- [ ] Search gems
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Create new gem
- [ ] Update gem details
- [ ] Update gem stock
- [ ] Delete gem

**Order Management:**
- [ ] View all orders
- [ ] Filter by status
- [ ] View order details
- [ ] Update order status
- [ ] Update payment status

**Audit Logs:**
- [ ] View all audit logs
- [ ] Filter by action type
- [ ] Filter by user
- [ ] Filter by date range
- [ ] Verify logs created for actions

#### 3. Repository Pattern Testing

**User Repository:**
```bash
# Test user operations
npm run test -- user.test.ts
```

- [ ] findById works
- [ ] findByEmail works
- [ ] searchUsers works
- [ ] create works
- [ ] update works
- [ ] delete works
- [ ] Role-based queries work

**Gem Repository:**
- [ ] findAll with pagination
- [ ] searchGems works
- [ ] findByCategory works
- [ ] findGemsWithFilters works
- [ ] Stock management works
- [ ] Price range queries work

**Order Repository:**
- [ ] Create order
- [ ] Find by user
- [ ] Find by status
- [ ] Update status
- [ ] Calculate totals

#### 4. Security Testing

**Authentication:**
- [ ] Unauthenticated access blocked
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected
- [ ] CSRF protection (if implemented)

**Authorization:**
- [ ] Non-admin cannot access admin routes
- [ ] Users can only access own data
- [ ] Role-based access enforced

**Input Validation:**
- [ ] SQL injection prevented (Supabase handles this)
- [ ] XSS prevention
- [ ] File upload validation
- [ ] Email format validation
- [ ] Password strength requirements

#### 5. Database Testing

**Supabase Connection:**
```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

- [ ] Connection successful
- [ ] Row Level Security enforced
- [ ] Policies working correctly

**Data Integrity:**
- [ ] Foreign keys enforced
- [ ] Unique constraints work
- [ ] Default values applied
- [ ] Timestamps auto-updated

#### 6. API Endpoint Testing

**User Endpoints:**
- [ ] GET /api/auth/profile
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/forgot-password
- [ ] POST /api/auth/2fa

**Admin Endpoints:**
- [ ] GET /api/admin/users
- [ ] POST /api/admin/users
- [ ] PUT /api/admin/users
- [ ] DELETE /api/admin/users
- [ ] GET /api/admin/gems
- [ ] POST /api/admin/gems
- [ ] PUT /api/admin/gems
- [ ] DELETE /api/admin/gems
- [ ] GET /api/admin/logs
- [ ] GET /api/admin/stats

#### 7. Performance Testing

**Repository Queries:**
- [ ] Pagination works efficiently
- [ ] Search is fast (<1s)
- [ ] Filtering performs well
- [ ] Index usage verified

**API Response Times:**
- [ ] Login < 500ms
- [ ] List queries < 1s
- [ ] Create/Update < 500ms
- [ ] Delete < 300ms

#### 8. Build & Deployment Testing

**Build:**
```bash
npm run build
```
- [x] Build succeeds ✅
- [x] No TypeScript errors ✅
- [x] No ESLint critical errors ✅

**Production Mode:**
```bash
npm run build && npm start
```
- [ ] App starts successfully
- [ ] All pages load
- [ ] API routes work
- [ ] Static assets serve

## Automated Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Test Users

After running `npx tsx scripts/seed-database.ts`:

- **Admin:** admin@royalgems.com / Admin123!@#
- **Customer:** customer@test.com / Customer123!@#

## Common Issues

### Issue: Supabase connection fails
**Solution:** Check .env.local has correct SUPABASE_URL and keys

### Issue: Auth returns 401
**Solution:** Verify access token is valid and not expired

### Issue: RLS blocks queries
**Solution:** Check user role and policy configuration

### Issue: TypeScript errors in tests
**Solution:** Update tsconfig.json to include test files

## Next Steps

After completing all tests:
1. ✅ Mark Step 7 complete
2. 🚀 Move to Step 8: Deployment
3. 📊 Monitor production metrics
4. 🔄 Set up CI/CD pipeline
