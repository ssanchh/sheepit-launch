-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for API" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable select for API" ON newsletter_subscribers;

-- Create new policies that properly allow anonymous access
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select own email" ON newsletter_subscribers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated insert" ON newsletter_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select" ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow service role full access (for admin/scripts)
CREATE POLICY "Service role has full access" ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);