/**
 * Input Validation Utility
 * Provides validation helpers for API routes
 */

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'uuid' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate input data against rules
 */
export function validateInput(data: any, rules: ValidationRule[]): ValidationResult {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const value = data[rule.field];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: rule.field,
        message: rule.message || `${rule.field} is required`,
      });
      continue;
    }

    // Skip further validation if not required and empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    if (rule.type) {
      const isValid = validateType(value, rule.type);
      if (!isValid) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be a valid ${rule.type}`,
        });
        continue;
      }
    }

    // Length/Range validation
    if (rule.min !== undefined || rule.max !== undefined) {
      const length = typeof value === 'string' ? value.length : typeof value === 'number' ? value : 0;
      
      if (rule.min !== undefined && length < rule.min) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be at least ${rule.min}`,
        });
      }
      
      if (rule.max !== undefined && length > rule.max) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be at most ${rule.max}`,
        });
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} format is invalid`,
        });
      }
    }

    // Custom validation
    if (rule.custom) {
      if (!rule.custom(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} validation failed`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate type
 */
function validateType(value: any, type: string): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    
    case 'boolean':
      return typeof value === 'boolean';
    
    case 'email':
      return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
    case 'url':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    
    case 'uuid':
      return typeof value === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    
    case 'array':
      return Array.isArray(value);
    
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    
    default:
      return true;
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Sanitize HTML input
 */
export function sanitizeHTML(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Common validation rules
 */
export const commonRules = {
  email: {
    type: 'email' as const,
    required: true,
    message: 'Invalid email address',
  },
  
  password: {
    type: 'string' as const,
    required: true,
    min: 12,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 12 characters with uppercase, lowercase, number, and special character',
  },
  
  price: {
    type: 'number' as const,
    required: true,
    min: 0,
    message: 'Price must be a positive number',
  },
  
  id: {
    type: 'uuid' as const,
    required: true,
    message: 'Invalid ID format',
  },
};

/**
 * Payment-specific validation
 */
export const paymentRules = {
  amount: {
    field: 'amount',
    type: 'number' as const,
    required: true,
    min: 0.01,
    max: 1000000,
    message: 'Invalid payment amount',
  },
  
  currency: {
    field: 'currency',
    type: 'string' as const,
    required: true,
    pattern: /^[A-Z]{3}$/,
    message: 'Invalid currency code',
  },
  
  orderId: {
    field: 'orderId',
    type: 'uuid' as const,
    required: true,
    message: 'Invalid order ID',
  },
};
