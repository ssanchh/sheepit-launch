-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow API to insert new subscribers
CREATE POLICY "Enable insert for API" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow API to select subscribers (for duplicate check)
CREATE POLICY "Enable select for API" ON newsletter_subscribers
  FOR SELECT
  USING (true);

-- Grant necessary permissions
GRANT INSERT, SELECT ON newsletter_subscribers TO anon;
GRANT INSERT, SELECT ON newsletter_subscribers TO authenticated;