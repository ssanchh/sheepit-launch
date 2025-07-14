-- Optimize product queries with vote counts
-- This creates a view that includes vote counts and user votes in a single query

-- Create a function to get products with vote data
CREATE OR REPLACE FUNCTION get_products_with_votes(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  name TEXT,
  tagline TEXT,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  images JSONB,
  created_by UUID,
  status TEXT,
  week_id UUID,
  launch_date DATE,
  is_live BOOLEAN,
  queue_position INTEGER,
  comment_count INTEGER,
  vote_count BIGINT,
  user_vote_id UUID,
  creator_first_name TEXT,
  creator_last_name TEXT,
  creator_handle TEXT,
  is_featured_paid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.created_at,
    p.updated_at,
    p.name,
    p.tagline,
    p.description,
    p.website_url,
    p.logo_url,
    p.images,
    p.created_by,
    p.status,
    p.week_id,
    p.launch_date,
    p.is_live,
    p.queue_position,
    p.comment_count,
    COALESCE(v.vote_count, 0) AS vote_count,
    uv.vote_id AS user_vote_id,
    u.first_name AS creator_first_name,
    u.last_name AS creator_last_name,
    u.handle AS creator_handle,
    CASE 
      WHEN fp.product_id IS NOT NULL THEN true 
      ELSE false 
    END AS is_featured_paid
  FROM products p
  -- Join with users table to get creator info
  LEFT JOIN users u ON p.created_by = u.id
  -- Get vote counts using a subquery for better performance
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS vote_count
    FROM votes
    WHERE product_id = p.id
  ) v ON true
  -- Get user's vote if user_id is provided
  LEFT JOIN LATERAL (
    SELECT id AS vote_id
    FROM votes
    WHERE product_id = p.id 
      AND user_id = user_id_param
    LIMIT 1
  ) uv ON user_id_param IS NOT NULL
  -- Check if product is featured
  LEFT JOIN featured_purchases fp ON p.id = fp.product_id 
    AND fp.active = true 
    AND fp.end_date >= NOW() 
    AND fp.start_date <= NOW()
  WHERE p.status = 'approved' 
    AND p.is_live = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_products_with_votes TO authenticated;
GRANT EXECUTE ON FUNCTION get_products_with_votes TO anon;

-- Create indexes to optimize the function
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_product ON votes(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_featured_purchases_active ON featured_purchases(product_id, active, start_date, end_date) WHERE active = true;

-- Create a function to update vote count for a specific product (for optimistic updates)
CREATE OR REPLACE FUNCTION get_product_vote_data(product_id_param UUID, user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
  vote_count BIGINT,
  user_vote_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(v.id) AS vote_count,
    MAX(CASE WHEN v.user_id = user_id_param THEN v.id END) AS user_vote_id
  FROM votes v
  WHERE v.product_id = product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_product_vote_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_vote_data TO anon;