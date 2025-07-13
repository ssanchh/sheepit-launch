-- Clean fix for votes table
-- First, check what policies currently exist
SELECT 
    'CURRENT POLICIES' as status,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;

-- Drop ALL existing policies on votes table to start fresh
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'votes'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.votes', pol.policyname);
    END LOOP;
END $$;

-- Now create the correct policies
CREATE POLICY "Anyone can view votes" ON public.votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.votes
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the new policies
SELECT 
    'NEW POLICIES' as status,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;

-- Test that we can count votes
SELECT 'Vote count test:', COUNT(*) as total_votes FROM votes;