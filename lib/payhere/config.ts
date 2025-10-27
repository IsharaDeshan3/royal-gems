/**
 * PayHere Payment Gateway Configuration
 */

export const payhereConfig = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || '',
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || '',
  isSandbox: process.env.PAYHERE_SANDBOX === 'true',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

// PayHere gateway URLs
export const PAYHERE_URLS = {
  sandbox: 'https://sandbox.payhere.lk/pay/checkout',
  production: 'https://www.payhere.lk/pay/checkout',
};

// Get the appropriate PayHere URL based on environment
export const getPayhereUrl = () => {
  return payhereConfig.isSandbox ? PAYHERE_URLS.sandbox : PAYHERE_URLS.production;
};

// Validate PayHere configuration
export const validatePayhereConfig = () => {
  const errors: string[] = [];

  if (!payhereConfig.merchantId) {
    errors.push('PAYHERE_MERCHANT_ID is not configured');
  }

  if (!payhereConfig.merchantSecret) {
    errors.push('PAYHERE_MERCHANT_SECRET is not configured');
  }

  if (!payhereConfig.baseUrl) {
    errors.push('NEXT_PUBLIC_BASE_URL is not configured');
  }

  if (errors.length > 0) {
    throw new Error(`PayHere configuration error: ${errors.join(', ')}`);
  }

  return true;
};

// Payment status mapping
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// PayHere status codes
export const PAYHERE_STATUS_CODES = {
  SUCCESS: '2',
  PENDING: '0',
  FAILED: '-1',
  CANCELLED: '-2',
  CHARGEBACK: '-3',
} as const;

// Map PayHere status codes to our payment status
export const mapPayhereStatus = (statusCode: string): string => {
  switch (statusCode) {
    case PAYHERE_STATUS_CODES.SUCCESS:
      return PAYMENT_STATUS.COMPLETED;
    case PAYHERE_STATUS_CODES.PENDING:
      return PAYMENT_STATUS.PROCESSING;
    case PAYHERE_STATUS_CODES.FAILED:
      return PAYMENT_STATUS.FAILED;
    case PAYHERE_STATUS_CODES.CANCELLED:
      return PAYMENT_STATUS.CANCELLED;
    case PAYHERE_STATUS_CODES.CHARGEBACK:
      return PAYMENT_STATUS.REFUNDED;
    default:
      return PAYMENT_STATUS.PENDING;
  }
};

// Currency codes
export const SUPPORTED_CURRENCIES = {
  LKR: 'LKR',
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
  AUD: 'AUD',
} as const;

export type Currency = keyof typeof SUPPORTED_CURRENCIES;
