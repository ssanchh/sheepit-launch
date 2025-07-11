-- =============================================
-- Sheep It Database Setup Script
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR NOT NULL,
  
  -- Profile Information
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  handle VARCHAR(50) UNIQUE,
  avatar_url VARCHAR,
  
  -- Social Media
  twitter_handle VARCHAR(50),
  website_url VARCHAR,
  
  -- Status
  profile_completed BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create weeks table (weekly cycles)
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  tagline VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  website_url VARCHAR NOT NULL,
  logo_url VARCHAR,
  video_url VARCHAR,
  created_by UUID NOT NULL REFERENCES users(id),
  week_id UUID NOT NULL REFERENCES weeks(id),
  
  -- Approval System
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN DEFAULT false,
  admin_notes TEXT,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  
  -- Queue Management System
  queue_position INTEGER,
  launch_week_id UUID REFERENCES weeks(id),
  is_live BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  week_id UUID NOT NULL REFERENCES weeks(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id, week_id)
);

-- Create winners table
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  week_id UUID NOT NULL REFERENCES weeks(id),
  position INTEGER NOT NULL CHECK (position IN (1, 2, 3)),
  badge_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  newsletter_name VARCHAR NOT NULL,
  utm_source VARCHAR NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  week_id UUID NOT NULL REFERENCES weeks(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies
-- =============================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public profiles" ON users
  FOR SELECT USING (profile_completed = true);

-- Products table policies
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = created_by AND status = 'pending');

CREATE POLICY "Admins can update all products" ON products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Votes table policies
CREATE POLICY "Users can view own votes" ON votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON votes
  FOR DELETE USING (auth.uid() = user_id);

-- Winners table policies
CREATE POLICY "Anyone can view winners" ON winners
  FOR SELECT USING (true);

-- Partners table policies
CREATE POLICY "Anyone can view active partners" ON partners
  FOR SELECT USING (active = true);

-- Weeks table policies
CREATE POLICY "Anyone can view weeks" ON weeks
  FOR SELECT USING (true);

-- Comments table policies
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Create Indexes for Performance
-- =============================================

CREATE INDEX idx_products_week_status ON products(week_id, status);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_queue_position ON products(queue_position);
CREATE INDEX idx_products_launch_week ON products(launch_week_id);
CREATE INDEX idx_products_is_live ON products(is_live);
CREATE INDEX idx_votes_product_week ON votes(product_id, week_id);
CREATE INDEX idx_votes_user_week ON votes(user_id, week_id);
CREATE INDEX idx_winners_week ON winners(week_id);
CREATE INDEX idx_weeks_active ON weeks(active);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_users_profile_completed ON users(profile_completed);
CREATE INDEX idx_comments_product_id ON comments(product_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- =============================================
-- Create Functions for Common Queries
-- =============================================

-- Function to get current week
CREATE OR REPLACE FUNCTION get_current_week()
RETURNS UUID AS $$
DECLARE
  current_week_id UUID;
BEGIN
  SELECT id INTO current_week_id
  FROM weeks
  WHERE active = true
  AND CURRENT_DATE BETWEEN start_date AND end_date
  LIMIT 1;
  
  RETURN current_week_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get product vote count
CREATE OR REPLACE FUNCTION get_product_vote_count(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  vote_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vote_count
  FROM votes
  WHERE product_id = product_uuid;
  
  RETURN COALESCE(vote_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has completed profile
CREATE OR REPLACE FUNCTION user_profile_completed(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  completed BOOLEAN;
BEGIN
  SELECT profile_completed INTO completed
  FROM users
  WHERE id = user_uuid;
  
  RETURN COALESCE(completed, false);
END;
$$ LANGUAGE plpgsql;

-- Function to add product to queue when approved
CREATE OR REPLACE FUNCTION add_to_queue(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  next_position INTEGER;
BEGIN
  -- Get the next available queue position
  SELECT COALESCE(MAX(queue_position), 0) + 1 INTO next_position
  FROM products
  WHERE status = 'approved' AND queue_position IS NOT NULL;
  
  -- Update the product with queue position
  UPDATE products 
  SET queue_position = next_position
  WHERE id = product_uuid;
  
  RETURN next_position;
END;
$$ LANGUAGE plpgsql;

-- Function to reorder queue positions
CREATE OR REPLACE FUNCTION reorder_queue(product_uuid UUID, new_position INTEGER)
RETURNS VOID AS $$
DECLARE
  old_position INTEGER;
BEGIN
  -- Get current position
  SELECT queue_position INTO old_position FROM products WHERE id = product_uuid;
  
  IF old_position IS NULL THEN
    RETURN;
  END IF;
  
  -- If moving up in queue (lower position number)
  IF new_position < old_position THEN
    UPDATE products 
    SET queue_position = queue_position + 1
    WHERE queue_position >= new_position 
    AND queue_position < old_position
    AND status = 'approved';
    
  -- If moving down in queue (higher position number)  
  ELSIF new_position > old_position THEN
    UPDATE products 
    SET queue_position = queue_position - 1
    WHERE queue_position > old_position 
    AND queue_position <= new_position
    AND status = 'approved';
  END IF;
  
  -- Update the product to new position
  UPDATE products 
  SET queue_position = new_position
  WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to assign next 10 products to a specific week
CREATE OR REPLACE FUNCTION assign_to_launch_week(target_week_id UUID)
RETURNS INTEGER AS $$
DECLARE
  assigned_count INTEGER := 0;
BEGIN
  -- Assign the top 10 queued products to the target week
  UPDATE products 
  SET launch_week_id = target_week_id
  WHERE id IN (
    SELECT id FROM products 
    WHERE status = 'approved' 
    AND queue_position IS NOT NULL 
    AND launch_week_id IS NULL
    ORDER BY queue_position ASC 
    LIMIT 10
  );
  
  GET DIAGNOSTICS assigned_count = ROW_COUNT;
  RETURN assigned_count;
END;
$$ LANGUAGE plpgsql;

-- Function to make products live when their week starts
CREATE OR REPLACE FUNCTION make_products_live(week_id UUID)
RETURNS INTEGER AS $$
DECLARE
  live_count INTEGER := 0;
BEGIN
  -- Set products as live for the current week
  UPDATE products 
  SET is_live = true
  WHERE launch_week_id = week_id 
  AND status = 'approved';
  
  -- Set previous week's products as not live
  UPDATE products 
  SET is_live = false
  WHERE launch_week_id != week_id 
  AND is_live = true;
  
  GET DIAGNOSTICS live_count = ROW_COUNT;
  RETURN live_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Create Initial Week (Current Week)
-- =============================================

INSERT INTO weeks (start_date, end_date, active)
VALUES (
  date_trunc('week', CURRENT_DATE)::date,
  (date_trunc('week', CURRENT_DATE) + interval '6 days')::date,
  true
);

-- =============================================
-- Storage Setup Instructions
-- =============================================

-- After running this SQL, you need to:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket named: product-logos
-- 3. Make it public
-- 4. Set upload size limit to 2MB
-- 5. Allow image file types: image/jpeg, image/png, image/gif, image/webp

-- =============================================
-- Migration Notes
-- =============================================

-- If you already have users in your database, run these updates:
-- UPDATE users SET profile_completed = false WHERE profile_completed IS NULL;
-- UPDATE products SET status = 'pending' WHERE approved = false;
-- UPDATE products SET status = 'approved' WHERE approved = true;

-- =============================================
-- Verification Queries
-- =============================================

-- Check if everything was created successfully
SELECT 'Tables created successfully' as status;

-- Show current week
SELECT * FROM weeks WHERE active = true;

-- Show table counts
SELECT 
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM votes) as votes_count,
  (SELECT COUNT(*) FROM winners) as winners_count,
  (SELECT COUNT(*) FROM partners) as partners_count,
  (SELECT COUNT(*) FROM weeks) as weeks_count; 