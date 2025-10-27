-- Create payments table to track PayHere transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
  payment_method VARCHAR(50),
  
  -- PayHere specific fields
  payhere_order_id VARCHAR(255),
  payhere_payment_id VARCHAR(255),
  merchant_id VARCHAR(255),
  status_code VARCHAR(10),
  md5sig VARCHAR(255),
  
  -- Payment status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- pending, processing, completed, failed, refunded, cancelled
  
  -- Customer details
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_name VARCHAR(255),
  
  -- Additional data
  items JSONB,
  billing_details JSONB,
  metadata JSONB,
  
  -- PayHere response data
  payhere_response JSONB,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Indexes for common queries
  CONSTRAINT payments_order_id_key UNIQUE(order_id)
);

-- Create indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payhere_payment_id ON payments(payhere_payment_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  order_id VARCHAR(255),
  
  -- Webhook details
  event_type VARCHAR(100),
  status VARCHAR(50),
  
  -- Raw webhook data
  payload JSONB NOT NULL,
  headers JSONB,
  
  -- Verification
  signature_valid BOOLEAN,
  processing_status VARCHAR(50) DEFAULT 'pending',
  -- pending, processed, failed, ignored
  
  error_message TEXT,
  
  -- Request metadata
  ip_address VARCHAR(100),
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create indexes for webhook logs
CREATE INDEX idx_webhook_logs_payment_id ON payment_webhook_logs(payment_id);
CREATE INDEX idx_webhook_logs_order_id ON payment_webhook_logs(order_id);
CREATE INDEX idx_webhook_logs_created_at ON payment_webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_processing_status ON payment_webhook_logs(processing_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_updated_at();

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('superadmin', 'admin', 'moderator')
    )
  );

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access to payments"
  ON payments
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for webhook logs (admin only)
CREATE POLICY "Admins can view webhook logs"
  ON payment_webhook_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('superadmin', 'admin')
    )
  );

-- Service role full access to webhook logs
CREATE POLICY "Service role full access to webhook logs"
  ON payment_webhook_logs
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add comment
COMMENT ON TABLE payments IS 'Stores payment transactions from PayHere gateway';
COMMENT ON TABLE payment_webhook_logs IS 'Logs all webhook callbacks from PayHere for audit trail';
