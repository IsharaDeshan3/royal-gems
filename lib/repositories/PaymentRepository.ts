/**
 * Payment Repository
 * Handles payment data operations with Supabase
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface Payment {
  id?: string;
  order_id: string;
  user_id?: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payhere_order_id?: string;
  payhere_payment_id?: string;
  merchant_id?: string;
  status_code?: string;
  md5sig?: string;
  status: string;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  items?: any;
  billing_details?: any;
  metadata?: any;
  payhere_response?: any;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface WebhookLog {
  id?: string;
  payment_id?: string;
  order_id: string;
  event_type?: string;
  status?: string;
  payload: any;
  headers?: any;
  signature_valid?: boolean;
  processing_status?: string;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  processed_at?: string;
}

export class PaymentRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create a new payment record
   */
  async create(payment: Payment): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }

    return data;
  }

  /**
   * Find payment by order ID
   */
  async findByOrderId(orderId: string): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error finding payment:', error);
      throw error;
    }

    return data;
  }

  /**
   * Find payment by PayHere payment ID
   */
  async findByPayherePaymentId(payherePaymentId: string): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('payhere_payment_id', payherePaymentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding payment:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update payment status
   */
  async updateStatus(
    orderId: string,
    status: string,
    additionalData?: Partial<Payment>
  ): Promise<Payment | null> {
    const updateData: any = { status, ...additionalData };

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await this.supabase
      .from('payments')
      .update(updateData)
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get payments by user ID
   */
  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get all payments (admin)
   */
  async findAll(limit = 50, offset = 0): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Search payments by status
   */
  async findByStatus(status: string, limit = 50, offset = 0): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create webhook log
   */
  async createWebhookLog(log: WebhookLog): Promise<WebhookLog | null> {
    const { data, error } = await this.supabase
      .from('payment_webhook_logs')
      .insert(log)
      .select()
      .single();

    if (error) {
      console.error('Error creating webhook log:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get webhook logs for a payment
   */
  async getWebhookLogs(orderId: string): Promise<WebhookLog[]> {
    const { data, error } = await this.supabase
      .from('payment_webhook_logs')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching webhook logs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Update webhook log processing status
   */
  async updateWebhookLog(
    logId: string,
    processingStatus: string,
    errorMessage?: string
  ): Promise<WebhookLog | null> {
    const updateData: any = {
      processing_status: processingStatus,
      processed_at: new Date().toISOString(),
    };

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { data, error } = await this.supabase
      .from('payment_webhook_logs')
      .update(updateData)
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      console.error('Error updating webhook log:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete payment (admin only)
   */
  async delete(orderId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('payments')
      .delete()
      .eq('order_id', orderId);

    if (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }

    return true;
  }
}
