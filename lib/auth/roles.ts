/**
 * Role checking utilities
 * Supports both lowercase (old schema) and capitalized (current schema) role names
 */

export type UserRole = 
  | 'SuperAdmin' | 'Admin' | 'Moderator' | 'User'
  | 'superadmin' | 'admin' | 'moderator' | 'user';

/**
 * Check if a user has admin privileges
 */
export function isAdmin(role: string): boolean {
  const adminRoles = ['superadmin', 'admin', 'moderator', 'SuperAdmin', 'Admin', 'Moderator'];
  return adminRoles.includes(role);
}

/**
 * Check if a user has super admin privileges
 */
export function isSuperAdmin(role: string): boolean {
  return role === 'superadmin' || role === 'SuperAdmin';
}

/**
 * Check if a user can perform admin actions (superadmin or admin only, not moderator)
 */
export function canManageContent(role: string): boolean {
  return ['superadmin', 'admin', 'SuperAdmin', 'Admin'].includes(role);
}

/**
 * Normalize role name to capitalized format (current schema)
 */
export function normalizeRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    'superadmin': 'SuperAdmin',
    'admin': 'Admin',
    'moderator': 'Moderator',
    'user': 'User',
    'SuperAdmin': 'SuperAdmin',
    'Admin': 'Admin',
    'Moderator': 'Moderator',
    'User': 'User'
  };
  
  return roleMap[role] || 'User';
}
