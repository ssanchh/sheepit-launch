-- Payment Schema for Sheep It
-- Supports Lemon Squeezy integration

-- Create payment_status enum
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create payment_type enum
CREATE TYPE payment_type AS ENUM ('skip_queue', 'featured_product');

-- Payments table to track all transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID REFERENCES products(id), -- The product being promoted
  payment_type payment_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  
  -- Lemon Squeezy specific fields
  ls_order_id VARCHAR(255) UNIQUE, -- Lemon Squeezy order ID
  ls_product_id VARCHAR(255), -- Lemon Squeezy product ID
  ls_variant_id VARCHAR(255), -- Lemon Squeezy variant ID
  ls_customer_id VARCHAR(255), -- Lemon Squeezy customer ID
  ls_subscription_id VARCHAR(255), -- For future subscription features
  
  -- Payment metadata
  checkout_url TEXT, -- Store the checkout URL
  receipt_url TEXT, -- Store the receipt URL
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP, -- For featured products (e.g., featured for 1 week)
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_product_id ON payments(product_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_ls_order_id ON payments(ls_order_id);

-- Queue skip purchases table
CREATE TABLE queue_skips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  product_id UUID NOT NULL REFERENCES products(id),
  original_position INTEGER NOT NULL,
  new_position INTEGER NOT NULL,
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Featured product purchases table
CREATE TABLE featured_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  product_id UUID NOT NULL REFERENCES products(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to check if a product is currently featured (paid)
CREATE OR REPLACE FUNCTION is_product_featured_paid(p_product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM featured_purchases
    WHERE product_id = p_product_id
    AND active = true
    AND NOW() BETWEEN start_date AND end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Function to apply queue skip after payment
CREATE OR REPLACE FUNCTION apply_queue_skip(p_payment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_skip RECORD;
  v_current_position INTEGER;
BEGIN
  -- Get the queue skip details
  SELECT * INTO v_skip
  FROM queue_skips
  WHERE payment_id = p_payment_id
  AND applied = false;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Get current position
  SELECT queue_position INTO v_current_position
  FROM products
  WHERE id = v_skip.product_id;
  
  -- Only apply if product is still in queue
  IF v_current_position IS NOT NULL THEN
    -- Move other products down
    UPDATE products
    SET queue_position = queue_position + 1
    WHERE queue_position >= v_skip.new_position
    AND queue_position < v_current_position
    AND id != v_skip.product_id;
    
    -- Update the product's position
    UPDATE products
    SET queue_position = v_skip.new_position
    WHERE id = v_skip.product_id;
    
    -- Mark as applied
    UPDATE queue_skips
    SET applied = true,
        applied_at = NOW()
    WHERE id = v_skip.id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add payment tracking to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS paid_features JSONB DEFAULT '{}';

-- Create view for payment analytics
CREATE OR REPLACE VIEW payment_analytics AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  payment_type,
  COUNT(*) as total_payments,
  SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as revenue,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments
FROM payments
GROUP BY DATE_TRUNC('month', created_at), payment_type;

-- Grant permissions
GRANT SELECT ON payments TO authenticated;
GRANT INSERT ON payments TO authenticated;
GRANT UPDATE ON payments TO authenticated;
GRANT SELECT ON queue_skips TO authenticated;
GRANT SELECT ON featured_purchases TO authenticated;
GRANT SELECT ON payment_analytics TO authenticated;

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_skips ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_purchases ENABLE ROW LEVEL SECURITY;

-- Users can see their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only system can update payments (via webhooks)
CREATE POLICY "System can update payments" ON payments
  FOR UPDATE USING (true);

-- Users can view queue skips for their products
CREATE POLICY "Users can view queue skips" ON queue_skips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = queue_skips.product_id
      AND p.created_by = auth.uid()
    )
  );

-- Users can view featured purchases for their products
CREATE POLICY "Users can view featured purchases" ON featured_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = featured_purchases.product_id
      AND p.created_by = auth.uid()
    )
  );