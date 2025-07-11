-- =============================================
-- Weekly Cycle Automation Setup
-- =============================================

-- Add vote_count column to products for performance
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS vote_count INTEGER DEFAULT 0;

-- Create index for vote counting
CREATE INDEX IF NOT EXISTS idx_products_vote_count ON products(vote_count DESC);

-- Function to update vote count when votes change
CREATE OR REPLACE FUNCTION update_product_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET vote_count = (
      SELECT COUNT(*) FROM votes WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products 
    SET vote_count = (
      SELECT COUNT(*) FROM votes WHERE product_id = OLD.product_id
    )
    WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote count updates
DROP TRIGGER IF EXISTS update_vote_count_trigger ON votes;
CREATE TRIGGER update_vote_count_trigger
AFTER INSERT OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_product_vote_count();

-- Update existing products with current vote counts
UPDATE products p
SET vote_count = (
  SELECT COUNT(*) FROM votes v WHERE v.product_id = p.id
);

-- Create cron job table for Supabase
CREATE TABLE IF NOT EXISTS cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR NOT NULL UNIQUE,
  schedule VARCHAR NOT NULL, -- Cron expression
  function_name VARCHAR NOT NULL,
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert weekly cycle jobs
INSERT INTO cron_jobs (job_name, schedule, function_name, enabled)
VALUES 
  ('close_week', '0 23 * * 0', 'weekly-cycle', true), -- Sunday 11 PM
  ('start_week', '0 0 * * 1', 'weekly-cycle', true)   -- Monday 12 AM
ON CONFLICT (job_name) DO NOTHING;

-- Function to get current week's products with proper vote counts
CREATE OR REPLACE FUNCTION get_current_week_products()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  tagline VARCHAR,
  description TEXT,
  website_url VARCHAR,
  logo_url VARCHAR,
  created_by UUID,
  vote_count INTEGER,
  featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.tagline,
    p.description,
    p.website_url,
    p.logo_url,
    p.created_by,
    p.vote_count,
    p.featured
  FROM products p
  WHERE p.status = 'approved'
  AND p.week_id = get_current_week()
  ORDER BY p.featured DESC, p.vote_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create view for easy winner querying
CREATE OR REPLACE VIEW weekly_winners AS
SELECT 
  w.week_id,
  w.position,
  p.id,
  p.name,
  p.tagline,
  p.description,
  p.website_url,
  p.logo_url,
  p.featured_image_url,
  p.video_url,
  p.status,
  p.created_at,
  p.updated_at,
  p.created_by,
  p.admin_notes,
  p.queue_position,
  p.launch_week_id,
  p.featured,
  p.is_live,
  p.vote_count,
  p.team_type,
  p.primary_goal,
  p.categories,
  wk.start_date,
  wk.end_date
FROM winners w
JOIN products p ON w.product_id = p.id
JOIN weeks wk ON w.week_id = wk.id
ORDER BY wk.start_date DESC, w.position ASC;