-- Newsletter and Email Notification Schema for Sheep It
-- Supports Beehiiv newsletter integration and email preferences

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id), -- Optional, for logged-in users
  first_name VARCHAR,
  last_name VARCHAR,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  beehiiv_subscriber_id VARCHAR, -- Beehiiv's subscriber ID for sync
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'pending')),
  source VARCHAR DEFAULT 'website', -- Where they subscribed from
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email preferences for users
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  
  -- Transactional emails (via Resend)
  product_approved BOOLEAN DEFAULT true,
  product_rejected BOOLEAN DEFAULT true,
  new_comment BOOLEAN DEFAULT true,
  product_live BOOLEAN DEFAULT true,
  vote_milestone BOOLEAN DEFAULT true, -- When product hits certain vote counts
  
  -- Marketing emails (via Beehiiv)
  weekly_newsletter BOOLEAN DEFAULT true,
  product_tips BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email logs for tracking sent emails
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email VARCHAR NOT NULL,
  email_type VARCHAR NOT NULL, -- 'product_approved', 'new_comment', etc.
  subject VARCHAR,
  provider VARCHAR NOT NULL, -- 'resend' or 'beehiiv'
  provider_message_id VARCHAR, -- ID from email provider
  status VARCHAR DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_user_id ON newsletter_subscribers(user_id);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_email_preferences_user_id ON email_preferences(user_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Newsletter subscribers policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own subscription" ON newsletter_subscribers
  FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Email preferences policies
CREATE POLICY "Users can view own email preferences" ON email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences" ON email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences" ON email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email logs policies (read-only for users)
CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Function to create default email preferences for new users
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create email preferences when user is created
CREATE TRIGGER create_email_preferences_on_user_create
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_email_preferences();

-- Function to sync newsletter subscription when user subscribes
CREATE OR REPLACE FUNCTION sync_newsletter_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is logged in and subscribing, link to their account
  IF NEW.user_id IS NOT NULL THEN
    UPDATE users 
    SET updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for newsletter subscription sync
CREATE TRIGGER sync_newsletter_on_subscribe
  AFTER INSERT OR UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION sync_newsletter_subscription();