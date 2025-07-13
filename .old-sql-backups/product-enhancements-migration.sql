-- Add new fields to products table for enhanced product pages
ALTER TABLE products
ADD COLUMN IF NOT EXISTS screenshot_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for view count
CREATE INDEX IF NOT EXISTS idx_products_view_count ON products(view_count DESC);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET view_count = view_count + 1
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;