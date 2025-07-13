-- Add new columns to products table for enhanced submission data
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS team_type VARCHAR(10) CHECK (team_type IN ('solo', 'team')),
ADD COLUMN IF NOT EXISTS primary_goal VARCHAR(50),
ADD COLUMN IF NOT EXISTS categories TEXT[];

-- Create an index on categories for better search performance
CREATE INDEX IF NOT EXISTS idx_products_categories ON products USING GIN (categories);

-- Add some sample data to test (optional)
-- UPDATE products SET categories = ARRAY['SaaS', 'Productivity'] WHERE id = 'some-id';