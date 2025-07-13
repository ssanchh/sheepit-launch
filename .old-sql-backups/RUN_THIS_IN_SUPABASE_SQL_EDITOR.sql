-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This will automatically add all new users to the newsletter

-- Create function to handle new user newsletter subscription
CREATE OR REPLACE FUNCTION handle_new_user_newsletter()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into newsletter_subscribers when a new user is created
  INSERT INTO newsletter_subscribers (
    email,
    user_id,
    status,
    source,
    first_name,
    subscribed_at
  )
  VALUES (
    NEW.email,
    NEW.id,
    'pending', -- Will be activated via API
    'signup',
    NEW.first_name,
    NOW()
  )
  ON CONFLICT (email) DO NOTHING; -- Avoid errors if email already exists
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-subscribe new users
DROP TRIGGER IF EXISTS on_user_created_newsletter ON users;
CREATE TRIGGER on_user_created_newsletter
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_newsletter();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_new_user_newsletter TO service_role;

-- Also update the newsletter_subscribers table to allow pending status
ALTER TABLE newsletter_subscribers 
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_status_check;

ALTER TABLE newsletter_subscribers 
  ADD CONSTRAINT newsletter_subscribers_status_check 
  CHECK (status IN ('active', 'unsubscribed', 'bounced', 'pending', 'failed'));

-- Add first_name column to newsletter_subscribers if it doesn't exist
ALTER TABLE newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);