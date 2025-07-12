-- Add featured rotation system
-- This migration adds support for rotating featured products

-- Add display duration to products (how many days to show)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS display_duration INTEGER DEFAULT 7;

-- Add flag for featured rotation products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured_rotation BOOLEAN DEFAULT FALSE;

-- Create featured rotation table
CREATE TABLE IF NOT EXISTS featured_rotation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  rotation_order INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_featured_rotation_active ON featured_rotation(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_featured_rotation_product ON featured_rotation(product_id);

-- Create function to get random featured product
CREATE OR REPLACE FUNCTION get_random_featured_product()
RETURNS UUID AS $$
DECLARE
  featured_product_id UUID;
BEGIN
  -- Get a random active featured product
  SELECT product_id INTO featured_product_id
  FROM featured_rotation
  WHERE is_active = TRUE
    AND end_date > NOW()
    AND start_date <= NOW()
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Increment impression count
  IF featured_product_id IS NOT NULL THEN
    UPDATE featured_rotation
    SET impression_count = impression_count + 1
    WHERE product_id = featured_product_id
      AND is_active = TRUE;
  END IF;
  
  RETURN featured_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_random_featured_product TO authenticated;
GRANT SELECT, UPDATE ON featured_rotation TO authenticated;

-- Add RLS policies
ALTER TABLE featured_rotation ENABLE ROW LEVEL SECURITY;

-- Anyone can view active featured products
CREATE POLICY "Featured products are viewable by everyone" ON featured_rotation
  FOR SELECT USING (is_active = TRUE);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can manage featured rotation" ON featured_rotation
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Create a table for guaranteed backlinks
CREATE TABLE IF NOT EXISTS product_backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  anchor_text VARCHAR(255) NOT NULL,
  target_url VARCHAR(500) NOT NULL,
  is_dofollow BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_backlinks_active ON product_backlinks(is_active);
CREATE INDEX IF NOT EXISTS idx_product_backlinks_product ON product_backlinks(product_id);

-- Grant permissions
GRANT SELECT ON product_backlinks TO authenticated;

-- Add RLS policies
ALTER TABLE product_backlinks ENABLE ROW LEVEL SECURITY;

-- Anyone can view active backlinks
CREATE POLICY "Backlinks are viewable by everyone" ON product_backlinks
  FOR SELECT USING (is_active = TRUE);