-- Create the missing auto_weekly_transition RPC function
-- This function handles the weekly transition of products from queue to live

-- Drop existing function if it exists (to handle return type changes)
DROP FUNCTION IF EXISTS auto_weekly_transition();

-- First, ensure we have the get_current_week function
CREATE OR REPLACE FUNCTION get_current_week()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM weeks WHERE active = true LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Create the auto_weekly_transition function
CREATE OR REPLACE FUNCTION auto_weekly_transition()
RETURNS TABLE (
  products_made_live INTEGER,
  products_made_inactive INTEGER,
  queue_updated BOOLEAN
) AS $$
DECLARE
  current_week_id UUID;
  live_count INTEGER := 0;
  inactive_count INTEGER := 0;
BEGIN
  -- Get current week
  current_week_id := get_current_week();
  
  IF current_week_id IS NULL THEN
    RAISE EXCEPTION 'No active week found';
  END IF;
  
  -- Step 1: Set previous week's products as not live
  UPDATE products 
  SET is_live = false
  WHERE is_live = true 
  AND launch_week_id != current_week_id;
  
  GET DIAGNOSTICS inactive_count = ROW_COUNT;
  
  -- Step 2: Make top 10 queued products live
  UPDATE products 
  SET 
    is_live = true, 
    launch_week_id = current_week_id,
    queue_position = NULL  -- Clear queue position when going live
  WHERE id IN (
    SELECT id FROM products 
    WHERE status = 'approved' 
    AND queue_position IS NOT NULL 
    AND is_live = false
    ORDER BY queue_position ASC 
    LIMIT 10
  );
  
  GET DIAGNOSTICS live_count = ROW_COUNT;
  
  -- Step 3: Update queue positions for remaining products
  -- Reorder queue to start from 1
  WITH numbered_queue AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY queue_position) as new_position
    FROM products
    WHERE status = 'approved' 
    AND queue_position IS NOT NULL
    AND is_live = false
  )
  UPDATE products p
  SET queue_position = nq.new_position
  FROM numbered_queue nq
  WHERE p.id = nq.id;
  
  -- Return results
  RETURN QUERY 
  SELECT 
    live_count AS products_made_live,
    inactive_count AS products_made_inactive,
    true AS queue_updated;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users (admin check should be in application)
GRANT EXECUTE ON FUNCTION auto_weekly_transition() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_week() TO authenticated;