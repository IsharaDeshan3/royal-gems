# Repository Layer Documentation

This directory contains the Data Access Layer for the Royal Gems Institute application, implementing the Repository Pattern for Supabase integration.

## Overview

The repository layer provides a clean abstraction over database operations, implementing the Repository Pattern with TypeScript interfaces and classes. This layer replaces direct database calls and provides:

- Type-safe database operations
- Consistent error handling
- Centralized data access logic
- Easy testing and mocking
- Clean separation of concerns

## Architecture

### Base Repository

- `BaseRepository<T>`: Interface defining common CRUD operations
- `BaseRepositoryImpl<T>`: Abstract base class implementing common functionality

### Specialized Repositories

- `UserRepository`: User management, authentication, and profile operations
- `GemRepository`: Gem CRUD, search, filtering, and inventory management
- `OrderRepository`: Order lifecycle management and history
- `AuditLogRepository`: Audit logging and compliance tracking

### Repository Factory

- `RepositoryFactory`: Singleton pattern for repository management
- Lazy loading of repository instances
- Dependency injection support

## Usage

### Initialization

```typescript
import { getRepositoryFactory } from '@/lib/repositories'
import { supabase } from '@/lib/supabase'

// Initialize repository factory
const repositories = getRepositoryFactory(supabase)
```

### User Operations

```typescript
const userRepo = repositories.getUserRepository()

// Create user
const user = await userRepo.create({
  email: 'user@example.com',
  password_hash: 'hashed_password',
  first_name: 'John',
  last_name: 'Doe',
  role: 'user'
})

// Find by email
const existingUser = await userRepo.findByEmail('user@example.com')

// Update profile
await userRepo.updateProfile(user.id, {
  phone: '+1234567890',
  is_verified: true
})

// Enable 2FA
await userRepo.enableTwoFactor(user.id, 'secret_key')
```

### Gem Operations

```typescript
const gemRepo = repositories.getGemRepository()

// Create gem
const gem = await gemRepo.create({
  name: 'Diamond Ring',
  price: 2500.00,
  category: 'Rings',
  stock_quantity: 5
})

// Search gems
const results = await gemRepo.searchGems('diamond', 20)

// Advanced filtering
const filtered = await gemRepo.findGemsWithFilters({
  category: 'Rings',
  minPrice: 1000,
  maxPrice: 5000
})

// Update stock
await gemRepo.updateStock(gem.id, 10)
```

### Order Operations

```typescript
const orderRepo = repositories.getOrderRepository()

// Create order with items
const order = await orderRepo.createOrderWithItems(
  {
    user_id: userId,
    shipping_address: { street: '123 Main St', city: 'NYC' }
  },
  [
    {
      gem_id: gemId,
      quantity: 1,
      unit_price: 2500.00,
      total_price: 2500.00
    }
  ]
)

// Update status
await orderRepo.updateStatus(order.id, 'confirmed')

// Get order history
const history = await orderRepo.getUserOrderHistory(userId)
```

### Audit Logging

```typescript
const auditRepo = repositories.getAuditLogRepository()

// Log user action
await auditRepo.logUserAction(userId, 'LOGIN', {
  ipAddress: '192.168.1.1',
  userAgent: 'Chrome/91.0'
})

// Log admin action
await auditRepo.logAdminAction(adminId, 'USER_UPDATED', {
  type: 'user',
  id: targetUserId
}, {
  oldValues: { role: 'user' },
  newValues: { role: 'admin' }
})

// Get recent activity
const logs = await auditRepo.getRecentActivity(10)
```

## Error Handling

All repository methods throw errors for database issues. Common error codes:

- `PGRST116`: Record not found (returns `null` for single operations)
- Other Supabase errors are re-thrown with original error details

## Type Safety

The repository layer provides full TypeScript support:

- Strongly typed interfaces for all entities
- Type-safe query builders
- Compile-time error checking
- IntelliSense support

## Testing

Repositories can be easily mocked for testing:

```typescript
const mockUserRepo = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  // ... other methods
}

// Inject mock repository
const repositories = {
  getUserRepository: () => mockUserRepo
}
```

## Migration from Direct Database Calls

Replace direct Supabase calls:

```typescript
// Old way
const { data } = await supabase.from('users').select('*').eq('email', email)

// New way
const userRepo = repositories.getUserRepository()
const user = await userRepo.findByEmail(email)
```

## Performance Considerations

- Use appropriate indexes (already created in schema)
- Implement pagination for large datasets
- Use `select` with specific columns when possible
- Consider caching for frequently accessed data

## Security

- Row Level Security (RLS) is enabled on all tables
- Policies control data access based on user roles
- Audit logging tracks all data modifications
- Input validation should be handled at the API layer