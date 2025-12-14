/**
 * Payment Creation API
 * Generates PayHere payment hash and creates payment record
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from '@/lib/repositories';
import { rateLimiters, getRateLimitIdentifier } from '@/lib/rate-limit';
import { validateInput, ValidationRule } from '@/lib/validation';
import { 
  generatePayhereHash, 
  formatPayhereAmount, 
  validatePaymentData 
} from '@/lib/payhere/hash';
import { payhereConfig, getPayhereUrl } from '@/lib/payhere/config';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for payment endpoints (strict)
    const clientId = getRateLimitIdentifier(request);
    const rateLimit = await rateLimiters.payment(clientId);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many payment requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Create per-request Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Get current user (optional - can create payments for guests)
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    // Create repositories with per-request client
    const repositories = getRepositoryFactory(supabase);
    const paymentRepository = repositories.getPaymentRepository();
    const auditLogRepository = repositories.getAuditLogRepository();
    
    const body = await request.json();

    // Validate input
    const validationRules: ValidationRule[] = [
      { field: 'order_id', type: 'string', required: true },
      { field: 'amount', type: 'number', required: true, min: 1, max: 10000000 },
      { field: 'currency', type: 'string', required: true },
      { field: 'first_name', type: 'string', required: true },
      { field: 'last_name', type: 'string', required: true },
      { field: 'email', type: 'email', required: true },
      { field: 'phone', type: 'string', required: true },
      { field: 'address', type: 'string', required: true },
      { field: 'city', type: 'string', required: true },
      { field: 'country', type: 'string', required: true },
    ];

    const validationResult = validateInput(body, validationRules);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: `Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}` },
        { status: 400 }
      );
    }

    // Additional payment-specific validation
    const paymentValidation = validatePaymentData({
      order_id: body.order_id,
      amount: body.amount,
      currency: body.currency,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      country: body.country,
    });

    if (!paymentValidation.valid) {
      return NextResponse.json(
        { error: `Payment validation failed: ${paymentValidation.errors.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if payment already exists
    const existingPayment = await paymentRepository.findByOrderId(body.order_id);
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment with this order ID already exists' },
        { status: 409 }
      );
    }

    // Format amount
    const formattedAmount = formatPayhereAmount(body.amount);

    // Generate PayHere hash
    const hash = generatePayhereHash({
      merchant_id: payhereConfig.merchantId,
      order_id: body.order_id,
      amount: formattedAmount,
      currency: body.currency,
    });

    // Create payment record in database
    const payment = await paymentRepository.create({
      order_id: body.order_id,
      user_id: authUser?.id,
      amount: body.amount,
      currency: body.currency,
      status: 'pending',
      customer_email: body.email,
      customer_phone: body.phone,
      customer_name: `${body.first_name} ${body.last_name}`,
      merchant_id: payhereConfig.merchantId,
      items: body.items,
      billing_details: {
        first_name: body.first_name,
        last_name: body.last_name,
        address: body.address,
        city: body.city,
        country: body.country,
      },
      metadata: {
        created_from: 'api',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Log the action
    if (authUser) {
      await auditLogRepository.create({
        user_id: authUser.id,
        action: 'PAYMENT_INITIATED',
        resource_type: 'payment',
        resource_id: payment.id!,
        details: {
          order_id: body.order_id,
          amount: body.amount,
          currency: body.currency,
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });
    }

    // Prepare PayHere fields
    const payhereFields = {
      merchant_id: payhereConfig.merchantId,
      return_url: `${payhereConfig.baseUrl}/payment/success`,
      cancel_url: `${payhereConfig.baseUrl}/payment/cancel`,
      notify_url: `${payhereConfig.baseUrl}/api/payment/webhook`,
      order_id: body.order_id,
      items: body.items || body.order_id,
      currency: body.currency,
      amount: formattedAmount,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      country: body.country,
      hash: hash,
      payhere_url: getPayhereUrl(),
    };

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      payhere_fields: payhereFields,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
