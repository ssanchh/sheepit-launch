-- =============================================
-- Setup for First Launch - August 4th, 2025
-- =============================================

-- Create the week for August 4-10, 2025
INSERT INTO weeks (start_date, end_date, active)
VALUES ('2025-08-04', '2025-08-10', false)
ON CONFLICT DO NOTHING;

-- Update queue limits for launch
-- This will limit how many products go live in the first week
CREATE OR REPLACE FUNCTION get_launch_limit()
RETURNS INTEGER AS $$
BEGIN
  -- Return 10 for the first launch, can be adjusted later
  RETURN 10;
END;
$$ LANGUAGE plpgsql;

-- Function to prepare first launch
CREATE OR REPLACE FUNCTION prepare_first_launch()
RETURNS TABLE (
  message TEXT,
  products_in_queue INTEGER,
  launch_date DATE
) AS $$
DECLARE
  week_id UUID;
  product_count INTEGER;
BEGIN
  -- Get the August 4th week ID
  SELECT id INTO week_id 
  FROM weeks 
  WHERE start_date = '2025-08-04';
  
  -- Count approved products in queue
  SELECT COUNT(*) INTO product_count
  FROM products
  WHERE status = 'approved'
  AND queue_position IS NOT NULL;
  
  RETURN QUERY
  SELECT 
    'First launch prepared for August 4th, 2025'::TEXT as message,
    product_count as products_in_queue,
    '2025-08-04'::DATE as launch_date;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing function first
DROP FUNCTION IF EXISTS auto_weekly_transition();

-- Update the auto weekly transition to handle the first launch specially
CREATE OR REPLACE FUNCTION auto_weekly_transition()
RETURNS TABLE (
  message TEXT,
  products_made_live INTEGER,
  new_week_id UUID
) AS $$
DECLARE
  old_week_id UUID;
  new_week_id UUID;
  live_count INTEGER := 0;
  launch_limit INTEGER;
  is_first_launch BOOLEAN;
BEGIN
  -- Check if this is the first launch (August 4th)
  SELECT COUNT(*) = 0 INTO is_first_launch
  FROM products
  WHERE is_live = true;
  
  -- Get launch limit
  launch_limit := get_launch_limit();
  
  -- Get current active week
  SELECT id INTO old_week_id
  FROM weeks
  WHERE active = true
  LIMIT 1;
  
  -- If no active week, activate the August 4th week
  IF old_week_id IS NULL THEN
    SELECT id INTO new_week_id
    FROM weeks
    WHERE start_date = '2025-08-04';
    
    IF new_week_id IS NOT NULL THEN
      UPDATE weeks SET active = true WHERE id = new_week_id;
    END IF;
  ELSE
    -- Normal weekly transition
    -- Deactivate current week
    UPDATE weeks SET active = false WHERE id = old_week_id;
    
    -- Create or activate next week
    SELECT id INTO new_week_id
    FROM weeks
    WHERE start_date = CURRENT_DATE
    AND active = false
    LIMIT 1;
    
    IF new_week_id IS NULL THEN
      -- Create new week
      INSERT INTO weeks (start_date, end_date, active)
      VALUES (
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 days',
        true
      )
      RETURNING id INTO new_week_id;
    ELSE
      -- Activate existing week
      UPDATE weeks SET active = true WHERE id = new_week_id;
    END IF;
  END IF;
  
  -- Make queued products live (limited by launch_limit)
  WITH products_to_launch AS (
    SELECT id
    FROM products
    WHERE status = 'approved'
    AND queue_position IS NOT NULL
    AND is_live = false
    ORDER BY queue_position ASC
    LIMIT launch_limit
  )
  UPDATE products
  SET 
    is_live = true,
    launch_week_id = new_week_id
  WHERE id IN (SELECT id FROM products_to_launch);
  
  GET DIAGNOSTICS live_count = ROW_COUNT;
  
  -- Log the transition
  INSERT INTO public.cron_logs (job_name, status, message, created_at)
  VALUES (
    'weekly_transition',
    'success',
    format('Transitioned to week %s. Made %s products live.', new_week_id, live_count),
    NOW()
  );
  
  RETURN QUERY
  SELECT 
    CASE 
      WHEN is_first_launch THEN 'First launch completed! Welcome to Sheep It!'
      ELSE 'Week transition completed'
    END::TEXT as message,
    live_count as products_made_live,
    new_week_id as new_week_id;
END;
$$ LANGUAGE plpgsql;

-- Create cron logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS cron_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Check current status
SELECT prepare_first_launch();