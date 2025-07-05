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

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

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

-- =============================================
-- Create Indexes for Performance
-- =============================================

CREATE INDEX idx_products_week_status ON products(week_id, status);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_votes_product_week ON votes(product_id, week_id);
CREATE INDEX idx_votes_user_week ON votes(user_id, week_id);
CREATE INDEX idx_winners_week ON winners(week_id);
CREATE INDEX idx_weeks_active ON weeks(active);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_users_profile_completed ON users(profile_completed);

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