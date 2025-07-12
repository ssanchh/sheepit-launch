-- Initial Setup for Sheep It Launch
-- Run this after setting up your Supabase project

-- Create the first week (adjust dates as needed)
INSERT INTO weeks (id, start_date, end_date, active)
VALUES (
  gen_random_uuid(),
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '6 days',
  true
)
ON CONFLICT DO NOTHING;

-- Create RPC function for reordering queue
CREATE OR REPLACE FUNCTION reorder_queue(moved_product_id UUID, new_position INTEGER)
RETURNS void AS $$
BEGIN
  -- Update positions for other products
  UPDATE products
  SET queue_position = queue_position + 1
  WHERE queue_position >= new_position
    AND id != moved_product_id
    AND status = 'pending';
    
  -- Set the new position for the moved product
  UPDATE products
  SET queue_position = new_position
  WHERE id = moved_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION reorder_queue TO authenticated;

-- Optional: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_queue_position ON products(queue_position) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_products_week_id ON products(week_id);
CREATE INDEX IF NOT EXISTS idx_votes_week_product ON votes(week_id, product_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Note: To make yourself admin, run this after creating your account:
-- UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';