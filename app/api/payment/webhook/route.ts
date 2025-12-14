/**
 * PayHere Webhook Handler
 * Receives and processes payment notifications from PayHere
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRepositoryFactory } from '@/lib/repositories';
import { verifyPayhereSignature } from '@/lib/payhere/hash';
import { mapPayhereStatus } from '@/lib/payhere/config';

export async function POST(request: NextRequest) {
  let webhookLogId: string | undefined;

  // Create Supabase client for webhook processing (server-side, no user context)
  // Webhooks come from PayHere servers, not authenticated users
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Create repositories with the supabase client
  const repositories = getRepositoryFactory(supabase);
  const paymentRepository = repositories.getPaymentRepository();
  const orderRepository = repositories.getOrderRepository();
  const auditLogRepository = repositories.getAuditLogRepository();

  try {
    // Parse form data from PayHere
    const formData = await request.formData();
    const payload: any = {};
    
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    // Extract headers for logging
    const headers: any = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Create webhook log
    const webhookLog = await paymentRepository.createWebhookLog({
      order_id: payload.order_id,
      event_type: 'payment_notification',
      status: payload.status_code,
      payload,
      headers,
      signature_valid: false,
      processing_status: 'pending',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    webhookLogId = webhookLog?.id;

    // Verify required fields
    if (!payload.order_id || !payload.merchant_id || !payload.payhere_amount || !payload.status_code || !payload.md5sig) {
      console.error('❌ Missing required webhook fields');
      
      if (webhookLogId) {
        await paymentRepository.updateWebhookLog(
          webhookLogId,
          'failed',
          'Missing required fields'
        );
      }

      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValidSignature = verifyPayhereSignature({
      merchant_id: payload.merchant_id,
      order_id: payload.order_id,
      payhere_amount: payload.payhere_amount,
      status_code: payload.status_code,
      md5sig: payload.md5sig,
    });

    if (!isValidSignature) {
      console.error('❌ Invalid PayHere signature');
      
      if (webhookLogId) {
        await paymentRepository.updateWebhookLog(
          webhookLogId,
          'failed',
          'Invalid signature'
        );
      }

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    console.log('✅ PayHere signature verified');

    // Update webhook log as verified
    if (webhookLogId) {
      await paymentRepository.updateWebhookLog(
        webhookLogId,
        'processing',
        undefined
      );
    }

    // Find payment record
    const payment = await paymentRepository.findByOrderId(payload.order_id);
    
    if (!payment) {
      console.error('❌ Payment not found:', payload.order_id);
      
      if (webhookLogId) {
        await paymentRepository.updateWebhookLog(
          webhookLogId,
          'failed',
          'Payment not found'
        );
      }

      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Map PayHere status to our status
    const newStatus = mapPayhereStatus(payload.status_code);

    console.log(`🔄 Updating payment ${payload.order_id} from ${payment.status} to ${newStatus}`);

    // Update payment record
    const updatedPayment = await paymentRepository.updateStatus(
      payload.order_id,
      newStatus,
      {
        payhere_payment_id: payload.payment_id,
        payhere_order_id: payload.payhere_order_id,
        status_code: payload.status_code,
        md5sig: payload.md5sig,
        payment_method: payload.method || payload.card_holder_name ? 'card' : 'unknown',
        payhere_response: payload,
      }
    );

    // Update order status if payment is completed
    if (newStatus === 'completed' && payment.user_id) {
      try {
        // Find associated order
        const orders = await orderRepository.findByUserId(payment.user_id);
        const order = orders.find(o => o.id === payload.order_id || o.id === payment.order_id);

        if (order) {
          await orderRepository.updateStatus(order.id!, 'confirmed');
          console.log('✅ Order status updated to confirmed:', order.id);
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        // Don't fail the webhook if order update fails
      }
    }

    // Create audit log
    if (payment.user_id) {
      await auditLogRepository.create({
        user_id: payment.user_id,
        action: 'PAYMENT_WEBHOOK_RECEIVED',
        resource_type: 'payment',
        resource_id: payment.id!,
        details: {
          order_id: payload.order_id,
          status_code: payload.status_code,
          new_status: newStatus,
          amount: payload.payhere_amount,
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });
    }

    // Mark webhook log as processed
    if (webhookLogId) {
      await paymentRepository.updateWebhookLog(
        webhookLogId,
        'processed',
        undefined
      );
    }

    console.log('✅ Webhook processed successfully');

    // Return success to PayHere
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);

    // Update webhook log if it exists
    if (webhookLogId) {
      try {
        await paymentRepository.updateWebhookLog(
          webhookLogId,
          'failed',
          error.message
        );
      } catch (logError) {
        console.error('Error updating webhook log:', logError);
      }
    }

    // Always return 200 to prevent PayHere from retrying
    // Log the error for investigation
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
