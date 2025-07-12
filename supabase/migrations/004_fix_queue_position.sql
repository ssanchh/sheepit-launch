-- Fix add_to_queue function to only count products in queue, not live ones
CREATE OR REPLACE FUNCTION add_to_queue(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  next_position INTEGER;
BEGIN
  -- Get the next available queue position
  -- Only count products that are approved, have a queue position, and are NOT live
  SELECT COALESCE(MAX(queue_position), 0) + 1 INTO next_position
  FROM products
  WHERE status = 'approved' 
    AND queue_position IS NOT NULL
    AND (is_live = false OR is_live IS NULL)
    AND launch_week_id IS NULL;
  
  -- Update the product with queue position
  UPDATE products 
  SET queue_position = next_position
  WHERE id = product_uuid;
  
  RETURN next_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to recalculate queue positions (to fix existing data)
CREATE OR REPLACE FUNCTION recalculate_queue_positions()
RETURNS void AS $$
DECLARE
  product_record RECORD;
  new_position INTEGER := 1;
BEGIN
  -- Reset all queue positions for non-live products
  FOR product_record IN 
    SELECT id, queue_position
    FROM products
    WHERE status = 'approved'
      AND queue_position IS NOT NULL
      AND (is_live = false OR is_live IS NULL)
      AND launch_week_id IS NULL
    ORDER BY queue_position ASC
  LOOP
    UPDATE products
    SET queue_position = new_position
    WHERE id = product_record.id;
    
    new_position := new_position + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION recalculate_queue_positions TO authenticated;

-- Fix the reorder_queue function as well
CREATE OR REPLACE FUNCTION reorder_queue(product_uuid UUID, new_position INTEGER)
RETURNS void AS $$
DECLARE
  old_position INTEGER;
  min_pos INTEGER;
  max_pos INTEGER;
BEGIN
  -- Get the current position of the product
  SELECT queue_position INTO old_position
  FROM products
  WHERE id = product_uuid;
  
  IF old_position IS NULL THEN
    RETURN;
  END IF;
  
  IF old_position = new_position THEN
    RETURN;
  END IF;
  
  -- Determine the range of positions to update
  IF new_position < old_position THEN
    min_pos := new_position;
    max_pos := old_position;
    
    -- Shift products down
    UPDATE products
    SET queue_position = queue_position + 1
    WHERE queue_position >= min_pos 
      AND queue_position < max_pos
      AND id != product_uuid
      AND status = 'approved'
      AND (is_live = false OR is_live IS NULL)
      AND launch_week_id IS NULL;
  ELSE
    min_pos := old_position;
    max_pos := new_position;
    
    -- Shift products up
    UPDATE products
    SET queue_position = queue_position - 1
    WHERE queue_position > min_pos 
      AND queue_position <= max_pos
      AND id != product_uuid
      AND status = 'approved'
      AND (is_live = false OR is_live IS NULL)
      AND launch_week_id IS NULL;
  END IF;
  
  -- Update the product's position
  UPDATE products
  SET queue_position = new_position
  WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the recalculation to fix existing queue positions
SELECT recalculate_queue_positions();