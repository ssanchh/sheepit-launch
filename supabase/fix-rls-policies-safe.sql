-- Enable RLS on existing tables (with IF EXISTS checks)
DO $$ 
BEGIN
    -- Enable RLS only on tables that exist
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
        ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'featured_purchases') THEN
        ALTER TABLE public.featured_purchases ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_intents') THEN
        ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_analytics') THEN
        ALTER TABLE public.payment_analytics ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
        ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'weekly_winners') THEN
        ALTER TABLE public.weekly_winners ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_badges') THEN
        ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cron_jobs') THEN
        ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist (to avoid conflicts)
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
DROP POLICY IF EXISTS "Anyone can view active featured purchases" ON public.featured_purchases;
DROP POLICY IF EXISTS "Users can view own payment intents" ON public.payment_intents;
DROP POLICY IF EXISTS "Users can create own payment intents" ON public.payment_intents;
DROP POLICY IF EXISTS "Service role can manage payment analytics" ON public.payment_analytics;
DROP POLICY IF EXISTS "Service role can manage newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can view weekly winners" ON public.weekly_winners;
DROP POLICY IF EXISTS "Anyone can view user badges" ON public.user_badges;
DROP POLICY IF EXISTS "Service role can manage cron jobs" ON public.cron_jobs;

-- Create policies for existing tables
-- Users table policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE POLICY "Users can view all profiles" ON public.users
            FOR SELECT USING (true);
        
        CREATE POLICY "Users can update own profile" ON public.users
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Products table policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        CREATE POLICY "Anyone can view approved products" ON public.products
            FOR SELECT USING (status = 'approved' OR created_by = auth.uid());
        
        CREATE POLICY "Users can insert own products" ON public.products
            FOR INSERT WITH CHECK (auth.uid() = created_by);
        
        CREATE POLICY "Users can update own products" ON public.products
            FOR UPDATE USING (auth.uid() = created_by);
    END IF;
END $$;

-- Votes table policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
        CREATE POLICY "Anyone can view votes" ON public.votes
            FOR SELECT USING (true);
        
        CREATE POLICY "Authenticated users can vote" ON public.votes
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own votes" ON public.votes
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete own votes" ON public.votes
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Comments table policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        CREATE POLICY "Anyone can view comments" ON public.comments
            FOR SELECT USING (true);
        
        CREATE POLICY "Authenticated users can comment" ON public.comments
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own comments" ON public.comments
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete own comments" ON public.comments
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Featured purchases policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'featured_purchases') THEN
        CREATE POLICY "Anyone can view active featured purchases" ON public.featured_purchases
            FOR SELECT USING (active = true);
    END IF;
END $$;

-- Payment intents policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_intents') THEN
        CREATE POLICY "Users can view own payment intents" ON public.payment_intents
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can create own payment intents" ON public.payment_intents
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Payment analytics policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_analytics') THEN
        CREATE POLICY "Service role can manage payment analytics" ON public.payment_analytics
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- Newsletter subscribers policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
        CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- Weekly winners policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'weekly_winners') THEN
        CREATE POLICY "Anyone can view weekly winners" ON public.weekly_winners
            FOR SELECT USING (true);
    END IF;
END $$;

-- User badges policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_badges') THEN
        CREATE POLICY "Anyone can view user badges" ON public.user_badges
            FOR SELECT USING (true);
    END IF;
END $$;

-- Cron jobs policies
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cron_jobs') THEN
        CREATE POLICY "Service role can manage cron jobs" ON public.cron_jobs
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;