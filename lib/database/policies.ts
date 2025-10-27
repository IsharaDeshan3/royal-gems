import { SupabaseClient } from '@supabase/supabase-js'

export async function createPolicies(supabase: SupabaseClient) {
  const policies = {
    users: [
      {
        name: 'Users can view their own profile',
        operation: 'select',
        expression: 'auth.uid() = id'
      },
      {
        name: 'Users can update their own profile',
        operation: 'update',
        expression: 'auth.uid() = id'
      },
      {
        name: 'Admins can view all users',
        operation: 'select',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin')
          )
        `
      }
    ],
    gems: [
      {
        name: 'Anyone can view approved gems',
        operation: 'select',
        expression: "is_active = true and approval_status = 'Approved'"
      },
      {
        name: 'Admins can view all gems',
        operation: 'select',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin', 'Moderator')
          )
        `
      },
      {
        name: 'Admins can modify gems',
        operation: 'all',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin', 'Moderator')
          )
        `
      }
    ],
    orders: [
      {
        name: 'Users can view their own orders',
        operation: 'select',
        expression: 'auth.uid() = user_id'
      },
      {
        name: 'Users can create their own orders',
        operation: 'insert',
        expression: 'auth.uid() = user_id or user_id is null'
      },
      {
        name: 'Admins can view all orders',
        operation: 'select',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin', 'Moderator')
          )
        `
      }
    ],
    order_items: [
      {
        name: 'Users can view their own order items',
        operation: 'select',
        expression: `
          exists (
            select 1 from orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
          )
        `
      },
      {
        name: 'Admins can view all order items',
        operation: 'select',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin', 'Moderator')
          )
        `
      }
    ],
    audit_logs: [
      {
        name: 'Only admins can view audit logs',
        operation: 'select',
        expression: `
          exists (
            select 1 from users
            where users.id = auth.uid()
            and users.role in ('SuperAdmin', 'Admin')
          )
        `
      },
      {
        name: 'System can insert audit logs',
        operation: 'insert',
        expression: 'true'
      }
    ]
  }

  return policies
}