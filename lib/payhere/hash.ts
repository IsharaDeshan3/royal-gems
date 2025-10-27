/**
 * PayHere Hash Generation Utility
 * Generates MD5 hash for PayHere payment requests
 */

import crypto from 'crypto';
import { payhereConfig } from './config';

export interface PaymentHashData {
  merchant_id: string;
  order_id: string;
  amount: string;
  currency: string;
}

/**
 * Generate MD5 hash for PayHere payment
 * Format: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
 */
export function generatePayhereHash(data: PaymentHashData): string {
  const { merchant_id, order_id, amount, currency } = data;
  const merchantSecret = payhereConfig.merchantSecret;

  if (!merchantSecret) {
    throw new Error('Merchant secret is not configured');
  }

  // Step 1: Hash the merchant secret
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  // Step 2: Create the hash string
  const hashString = `${merchant_id}${order_id}${amount}${currency}${hashedSecret}`;

  // Step 3: Generate final hash
  const hash = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  return hash;
}

/**
 * Verify webhook signature from PayHere
 * Format: MD5(merchant_id + order_id + payhere_amount + status_code + MD5(merchant_secret))
 */
export function verifyPayhereSignature(data: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  status_code: string;
  md5sig: string;
}): boolean {
  const { merchant_id, order_id, payhere_amount, status_code, md5sig } = data;
  const merchantSecret = payhereConfig.merchantSecret;

  if (!merchantSecret) {
    throw new Error('Merchant secret is not configured');
  }

  try {
    // Step 1: Hash the merchant secret
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    // Step 2: Create the hash string
    const hashString = `${merchant_id}${order_id}${payhere_amount}${status_code}${hashedSecret}`;

    // Step 3: Generate hash
    const calculatedHash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // Step 4: Compare hashes
    return calculatedHash === md5sig.toUpperCase();
  } catch (error) {
    console.error('Error verifying PayHere signature:', error);
    return false;
  }
}

/**
 * Format amount for PayHere (2 decimal places)
 */
export function formatPayhereAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Validate payment data before sending to PayHere
 */
export function validatePaymentData(data: {
  order_id: string;
  amount: number;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.order_id || data.order_id.trim() === '') {
    errors.push('Order ID is required');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!data.currency) {
    errors.push('Currency is required');
  }

  if (!data.first_name || data.first_name.trim() === '') {
    errors.push('First name is required');
  }

  if (!data.last_name || data.last_name.trim() === '') {
    errors.push('Last name is required');
  }

  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone number is required');
  }

  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }

  if (!data.city || data.city.trim() === '') {
    errors.push('City is required');
  }

  if (!data.country || data.country.trim() === '') {
    errors.push('Country is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
