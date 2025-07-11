-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;

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

-- Product analytics policies (public read)
CREATE POLICY "Anyone can view product analytics" ON public.product_analytics
  FOR SELECT USING (true);

-- Featured purchases policies
CREATE POLICY "Anyone can view active featured purchases" ON public.featured_purchases
  FOR SELECT USING (active = true);

-- Payment intents policies (restricted)
CREATE POLICY "Users can view own payment intents" ON public.payment_intents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment intents" ON public.payment_intents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment analytics policies (admin only - will need service role)
CREATE POLICY "Service role can manage payment analytics" ON public.payment_analytics
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Newsletter subscribers policies
CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Weekly winners policies (public read)
CREATE POLICY "Anyone can view weekly winners" ON public.weekly_winners
  FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Anyone can view user badges" ON public.user_badges
  FOR SELECT USING (true);

-- Cron jobs policies (service role only)
CREATE POLICY "Service role can manage cron jobs" ON public.cron_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');