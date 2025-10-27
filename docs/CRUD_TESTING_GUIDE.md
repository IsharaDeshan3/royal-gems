# CRUD Operations Testing Guide
## Royal Gems Institute - Admin & Frontend Interconnection Tests

This document provides a comprehensive guide to test all CRUD operations and verify proper interconnection between admin panel, database, and public frontend.

---

## 🔧 **Setup & Prerequisites**

1. **Environment Setup**
   - Ensure `.env.local` is configured with all required variables
   - Supabase project is set up with all migrations applied
   - Storage buckets are configured (`gems-images`)
   - Development server is running: `npm run dev`

2. **Test Admin Account**
   - Email: `admin123@gmail.com`
   - Role: Admin or SuperAdmin
   - Ensure account has admin access

3. **Database State**
   - Clear any test data before running tests
   - Note initial product count in database

---

## 📦 **Product (Gems) CRUD Testing**

### **Test 1: Create Product (Admin → Database → Frontend)**

**Objective**: Verify that products created in admin panel appear in database and public collection page

**Steps**:
1. ✅ Login to admin panel at `/admin/login`
2. ✅ Navigate to `/admin/gems`
3. ✅ Click "Add Product" button
4. ✅ Fill in product details:
   - Name: `Test Ruby Premium`
   - Description: `Beautiful test ruby for CRUD verification`
   - Price: `1500`
   - Category: `Ruby`
   - Stock: `10`
   - Upload an image OR enter image URL
5. ✅ Click "Create Product"
6. ✅ Verify success message/no errors in console
7. ✅ Check admin gems list - new product should appear immediately
8. ✅ Open new tab → Navigate to `/collection`
9. ✅ Verify new product appears in collection grid
10. ✅ Check Supabase database → `gems` table
11. ✅ Verify new record exists with correct data

**Expected Results**:
- ✅ Product appears in admin list immediately
- ✅ Product visible on public collection page
- ✅ Database record created with matching data
- ✅ Image uploads successfully if file was used
- ✅ Audit log entry created for CREATE_GEM action

**API Endpoints Tested**:
- `POST /api/admin/gems` - Creates product
- `POST /api/admin/upload` - Uploads image (if file used)
- `GET /api/products` - Public product listing

---

### **Test 2: Update Product (Admin → Database → Frontend)**

**Objective**: Verify product updates reflect across all systems

**Steps**:
1. ✅ In admin panel at `/admin/gems`
2. ✅ Select existing product (created in Test 1)
3. ✅ Click edit button or modify directly:
   - Change price to `1750`
   - Update description
   - Change stock to `5`
4. ✅ Save changes
5. ✅ Verify admin list shows updated values
6. ✅ Refresh `/collection` page
7. ✅ Verify updated price and details show correctly
8. ✅ Check database for updated values

**Expected Results**:
- ✅ Changes reflected immediately in admin panel
- ✅ Public page shows updated information
- ✅ Database record updated correctly
- ✅ Audit log entry for UPDATE_GEM action

**API Endpoints Tested**:
- `PUT /api/admin/gems` - Updates product
- `GET /api/products` - Fetches updated data

---

### **Test 3: Toggle Product Active Status**

**Objective**: Verify inactive products don't appear on public pages

**Steps**:
1. ✅ In admin panel, find Test Ruby Premium
2. ✅ Click "Deactivate" or toggle active status
3. ✅ Verify status changes to "Inactive" in admin
4. ✅ Navigate to `/collection`
5. ✅ Verify product NO LONGER appears
6. ✅ Return to admin panel
7. ✅ Reactivate product
8. ✅ Verify product reappears on collection page

**Expected Results**:
- ✅ Inactive products hidden from public
- ✅ Admin can still see inactive products (marked as such)
- ✅ Database `is_active` field updated
- ✅ Toggle works both ways (activate/deactivate)

**API Endpoints Tested**:
- `PUT /api/admin/gems` - Updates is_active status
- `GET /api/products` - Filters active products only

---

### **Test 4: Delete Product (Admin → Database → Frontend)**

**Objective**: Verify product deletion removes from all systems

**Steps**:
1. ✅ In admin panel at `/admin/gems`
2. ✅ Find Test Ruby Premium product
3. ✅ Click delete/trash button
4. ✅ Confirm deletion in confirmation dialog
5. ✅ Verify product removed from admin list
6. ✅ Navigate to `/collection`
7. ✅ Verify product no longer visible
8. ✅ Check database - record should be deleted
9. ✅ Check audit logs for DELETE_GEM entry

**Expected Results**:
- ✅ Product removed from admin panel immediately
- ✅ Product removed from public collection
- ✅ Database record deleted (or soft-deleted if implemented)
- ✅ Related images removed from storage (if cleanup implemented)
- ✅ Audit log records deletion with admin details

**API Endpoints Tested**:
- `DELETE /api/admin/gems?id={productId}` - Deletes product
- `GET /api/products` - Confirms removal

---

## 🛒 **Order CRUD Testing**

### **Test 5: Create Order (Frontend → Database → Admin)**

**Objective**: Verify customer orders flow from frontend to admin panel

**Steps**:
1. ✅ As customer, navigate to `/collection`
2. ✅ Add products to cart (minimum 2 items)
3. ✅ Click cart icon, verify items
4. ✅ Proceed to checkout
5. ✅ Fill in billing details
6. ✅ Complete payment (test/sandbox mode)
7. ✅ Verify success page shown
8. ✅ Login to admin panel
9. ✅ Navigate to `/admin/orders`
10. ✅ Verify new order appears
11. ✅ Check order details match cart items
12. ✅ Verify database has order record

**Expected Results**:
- ✅ Order created in database
- ✅ Order visible in admin panel
- ✅ Order items correctly linked
- ✅ Payment status recorded
- ✅ Customer details saved
- ✅ Total amount calculated correctly

**API Endpoints Tested**:
- `POST /api/payment/create` - Initiates payment
- `POST /api/payment/webhook` - Confirms payment
- Orders table populated via repository

---

### **Test 6: Update Order Status (Admin → Database)**

**Objective**: Verify order status updates work correctly

**Steps**:
1. ✅ In admin panel at `/admin/orders`
2. ✅ Select recent order
3. ✅ Change status from "pending" to "processing"
4. ✅ Verify status updates immediately
5. ✅ Change to "shipped"
6. ✅ Change to "delivered"
7. ✅ Check database for status updates
8. ✅ Verify audit logs record each status change

**Expected Results**:
- ✅ Status updates reflected immediately
- ✅ Database record updated
- ✅ Audit trail maintained
- ✅ No errors or data loss

**API Endpoints Tested**:
- `PUT /api/admin/orders` - Updates order status

---

## 👥 **User Management CRUD Testing**

### **Test 7: Create User (Admin → Database)**

**Objective**: Verify admin can create new users

**Steps**:
1. ✅ Navigate to `/admin/users`
2. ✅ Click "New User"
3. ✅ Fill in details:
   - Email: `test.user@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Role: `Moderator`
   - Password: (secure password)
4. ✅ Create user
5. ✅ Verify user appears in list
6. ✅ Check database for user record
7. ✅ Verify password is hashed

**Expected Results**:
- ✅ User created successfully
- ✅ Password properly hashed
- ✅ User can login with credentials
- ✅ Audit log created

**API Endpoints Tested**:
- `POST /api/admin/users` - Creates user

---

### **Test 8: Update User Role (Admin → Database)**

**Objective**: Verify role changes work correctly

**Steps**:
1. ✅ Find test user in `/admin/users`
2. ✅ Change role from Moderator to Admin
3. ✅ Verify update successful
4. ✅ Logout and login as test user
5. ✅ Verify new permissions work
6. ✅ Check database for updated role

**Expected Results**:
- ✅ Role updated immediately
- ✅ New permissions active
- ✅ Audit log records change
- ✅ Re-authentication may be required

**API Endpoints Tested**:
- `PUT /api/admin/users` - Updates user role

---

### **Test 9: Suspend/Activate User**

**Objective**: Verify user suspension works

**Steps**:
1. ✅ In `/admin/users`, find test user
2. ✅ Click "Suspend"
3. ✅ Verify status shows "Suspended"
4. ✅ Try to login as suspended user
5. ✅ Verify login fails with appropriate message
6. ✅ Reactivate user
7. ✅ Verify can login again

**Expected Results**:
- ✅ Suspended users cannot login
- ✅ Status reflected in database
- ✅ Reactivation works immediately

**API Endpoints Tested**:
- `PUT /api/admin/users` - Updates is_active status

---

### **Test 10: Delete User (Admin → Database)**

**Objective**: Verify user deletion works

**Steps**:
1. ✅ Find test user in admin panel
2. ✅ Click delete button
3. ✅ Confirm deletion (requires re-auth)
4. ✅ Enter admin password
5. ✅ Verify user removed from list
6. ✅ Check database - record deleted
7. ✅ Verify orphaned data handled correctly

**Expected Results**:
- ✅ User deleted successfully
- ✅ Related data handled (orders, etc.)
- ✅ Audit log records deletion
- ✅ Re-authentication enforced

**API Endpoints Tested**:
- `POST /api/auth/reauth` - Re-authenticates admin
- `DELETE /api/admin/users?id={userId}` - Deletes user

---

## 🔍 **Audit Logs Testing**

### **Test 11: Verify Audit Trail**

**Objective**: Ensure all admin actions are logged

**Steps**:
1. ✅ Perform various admin actions:
   - Create product
   - Update product
   - Delete product
   - Create user
   - Update user role
   - Delete user
2. ✅ Navigate to `/admin/logs`
3. ✅ Verify all actions appear in logs
4. ✅ Check each log entry contains:
   - Admin email
   - Action type
   - Resource type/ID
   - Timestamp
   - IP address
   - Success/failure status

**Expected Results**:
- ✅ All actions logged
- ✅ Log details complete
- ✅ Searchable and filterable
- ✅ Timestamps accurate

**API Endpoints Tested**:
- `GET /api/admin/logs` - Fetches audit logs

---

## 🖼️ **Image Upload Testing**

### **Test 12: Product Image Upload**

**Objective**: Verify image upload works end-to-end

**Steps**:
1. ✅ In `/admin/gems`, create new product
2. ✅ Click file upload button
3. ✅ Select image file (< 5MB, valid format)
4. ✅ Verify preview appears
5. ✅ Complete product creation
6. ✅ Check Supabase Storage bucket
7. ✅ Verify image uploaded successfully
8. ✅ Navigate to `/collection`
9. ✅ Verify product shows uploaded image

**Expected Results**:
- ✅ Image uploads successfully
- ✅ File stored in Supabase Storage
- ✅ Public URL generated
- ✅ Image displays on frontend
- ✅ Fallback image shown if upload fails

**API Endpoints Tested**:
- `POST /api/admin/upload` - Uploads image file

---

## ✅ **Integration Tests Summary**

### **Critical Paths to Verify**:

1. **Admin Create → Frontend Display**
   - Products created in admin appear on collection page
   
2. **Admin Update → Frontend Refresh**
   - Changes in admin reflect on frontend
   
3. **Admin Delete → Frontend Removal**
   - Deleted items removed from public view
   
4. **Frontend Order → Admin Visibility**
   - Customer orders visible in admin panel
   
5. **Database Consistency**
   - All operations update database correctly
   
6. **Audit Trail Completeness**
   - All admin actions logged properly

---

## 🐛 **Common Issues & Debugging**

### **Product not appearing on frontend**:
- Check if product is marked as active (`is_active = true`)
- Verify `/api/products` endpoint returns the product
- Check browser console for fetch errors
- Ensure Supabase RLS policies allow public read

### **Images not uploading**:
- Verify Supabase Storage bucket exists (`gems-images`)
- Check bucket is public
- Verify service role key is correct
- Check file size < 5MB
- Verify file type is image/*

### **Admin actions not working**:
- Check authentication (admin logged in)
- Verify CSRF token present
- Check admin role has permissions
- Review browser console for API errors

### **Database not updating**:
- Check Supabase connection
- Verify RLS policies (may need to disable for testing)
- Check repository implementations
- Review Supabase logs for errors

---

## 📊 **Test Results Template**

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Create Product | ⏸️ | |
| 2 | Update Product | ⏸️ | |
| 3 | Toggle Active | ⏸️ | |
| 4 | Delete Product | ⏸️ | |
| 5 | Create Order | ⏸️ | |
| 6 | Update Order Status | ⏸️ | |
| 7 | Create User | ⏸️ | |
| 8 | Update User Role | ⏸️ | |
| 9 | Suspend/Activate User | ⏸️ | |
| 10 | Delete User | ⏸️ | |
| 11 | Audit Logs | ⏸️ | |
| 12 | Image Upload | ⏸️ | |

**Status Legend**:
- ✅ Passed
- ❌ Failed
- ⏸️ Not Tested
- ⚠️ Partial Pass

---

## 🔄 **Continuous Testing Checklist**

After each code change, verify:
- [ ] All CRUD operations still work
- [ ] Frontend displays updated data
- [ ] Database records are consistent
- [ ] Audit logs are generated
- [ ] Images load correctly
- [ ] No console errors
- [ ] Authentication still works
- [ ] Authorization rules enforced

---

## 📝 **Notes for Developers**

1. **Always test in this order**: Admin → Database → Frontend
2. **Use browser DevTools** to monitor API calls
3. **Check Supabase Dashboard** for database state
4. **Review audit logs** after each action
5. **Test with multiple browsers** if possible
6. **Clear cache** between tests if needed
7. **Use incognito mode** for testing as different user types

---

**Last Updated**: October 27, 2025
**Version**: 1.0
**Status**: Ready for Testing
