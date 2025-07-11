-- Enable RLS on all existing tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_skips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;
DROP POLICY IF EXISTS "Authenticated users can vote" ON public.votes;
DROP POLICY IF EXISTS "Users can update own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Products table policies
CREATE POLICY "Anyone can view approved products" ON public.products
  FOR SELECT USING (status = 'approved' OR created_by = auth.uid());

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = created_by);

-- Votes table policies
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments table policies
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Featured purchases policies
CREATE POLICY "Anyone can view active featured purchases" ON public.featured_purchases
  FOR SELECT USING (active = true);

-- Queue skips policies
CREATE POLICY "Anyone can view queue skips" ON public.queue_skips
  FOR SELECT USING (true);

-- Weeks policies
CREATE POLICY "Anyone can view weeks" ON public.weeks
  FOR SELECT USING (true);

-- Winners policies  
CREATE POLICY "Anyone can view winners" ON public.winners
  FOR SELECT USING (true);

-- Newsletter subscribers policies (restrict to service role)
CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Email logs policies (restrict to service role)
CREATE POLICY "Service role can manage email logs" ON public.email_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Email preferences policies
CREATE POLICY "Users can view own email preferences" ON public.email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences" ON public.email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences" ON public.email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Partners policies (public read)
CREATE POLICY "Anyone can view partners" ON public.partners
  FOR SELECT USING (true);

-- Payments policies (users can see their own)
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Cron jobs policies (service role only)
CREATE POLICY "Service role can manage cron jobs" ON public.cron_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');