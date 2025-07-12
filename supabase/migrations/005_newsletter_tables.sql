-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source VARCHAR(100), -- 'signup', 'profile_completion', 'manual', etc.
  beehiiv_subscriber_id VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_user_id ON newsletter_subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- Create email preferences table if not exists
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  product_approved BOOLEAN DEFAULT TRUE,
  product_rejected BOOLEAN DEFAULT TRUE,
  new_comment BOOLEAN DEFAULT TRUE,
  product_live BOOLEAN DEFAULT TRUE,
  vote_milestone BOOLEAN DEFAULT TRUE,
  weekly_newsletter BOOLEAN DEFAULT TRUE,
  product_tips BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create email logs table if not exists
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  email_type VARCHAR(100) NOT NULL,
  subject VARCHAR(500),
  provider VARCHAR(50) DEFAULT 'resend',
  provider_message_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for email tables
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers policies
CREATE POLICY "Users can view their own subscription" ON newsletter_subscribers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Email preferences policies
CREATE POLICY "Users can view their own preferences" ON email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email logs policies (view only for users)
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON newsletter_subscribers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_preferences TO authenticated;
GRANT SELECT ON email_logs TO authenticated;