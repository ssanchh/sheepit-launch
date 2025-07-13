-- Add comment_count column to products table for better performance
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Create index for comment counting
CREATE INDEX IF NOT EXISTS idx_products_comment_count ON products(comment_count DESC);

-- Function to update comment count when comments change
CREATE OR REPLACE FUNCTION update_product_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET comment_count = (
      SELECT COUNT(*) FROM comments WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products 
    SET comment_count = (
      SELECT COUNT(*) FROM comments WHERE product_id = OLD.product_id
    )
    WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment count updates
DROP TRIGGER IF EXISTS update_comment_count_trigger ON comments;
CREATE TRIGGER update_comment_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_product_comment_count();

-- Update existing products with current comment counts
UPDATE products p
SET comment_count = (
  SELECT COUNT(*) FROM comments c WHERE c.product_id = p.id
);