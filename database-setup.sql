-- =============================================
-- Sheep It Database Setup Script
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
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
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
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

-- Products table policies
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (approved = true);

CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = created_by);

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

CREATE INDEX idx_products_week_approved ON products(week_id, approved);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_votes_product_week ON votes(product_id, week_id);
CREATE INDEX idx_votes_user_week ON votes(user_id, week_id);
CREATE INDEX idx_winners_week ON winners(week_id);
CREATE INDEX idx_weeks_active ON weeks(active);

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
-- Sample Data (Optional - for testing)
-- =============================================

-- Insert a sample user (you can remove this)
-- Note: This will only work after a user has signed up through your app
-- INSERT INTO users (id, email, full_name) VALUES 
-- ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');

-- Insert sample products (you can remove this)
-- INSERT INTO products (name, tagline, description, website_url, created_by, week_id, approved) VALUES
-- ('Sample Product', 'A great indie product', 'This is a longer description of our awesome product that solves real problems.', 'https://example.com', '00000000-0000-0000-0000-000000000000', (SELECT id FROM weeks WHERE active = true LIMIT 1), true);

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