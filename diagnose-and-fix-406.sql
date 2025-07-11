-- Comprehensive script to diagnose and fix 406 errors on sheepit.io
-- Run this in your Supabase SQL Editor

-- STEP 1: Check current RLS policies on votes table
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;

-- STEP 2: Check if RLS is enabled on votes table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'votes';

-- STEP 3: Test current access (this might fail with current policies)
-- Try to count votes as an anonymous user would
SELECT COUNT(*) as total_votes FROM votes;

-- STEP 4: Fix the votes table RLS policies
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can insert own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON public.votes;

-- Create new policies that allow proper access
-- Allow anyone to view/count votes (needed for product pages)
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

-- Allow authenticated users to vote
CREATE POLICY "Authenticated users can insert votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own votes
CREATE POLICY "Users can update own votes" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- STEP 5: Verify the new policies
SELECT 
    'After Fix' as status,
    policyname, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;

-- STEP 6: Test access again
SELECT 
    'Vote Count Test' as test,
    COUNT(*) as total_votes 
FROM votes;

-- STEP 7: Check other tables that might have similar issues
-- Products table should allow viewing approved products
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('products', 'users', 'weeks', 'winners', 'comments')
AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- STEP 8: Fix any other restrictive policies if needed
-- Ensure products can be viewed when approved
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
CREATE POLICY "Anyone can view approved products" ON public.products
  FOR SELECT USING (status = 'approved' OR created_by = auth.uid());

-- Ensure weeks can be viewed by anyone
DROP POLICY IF EXISTS "Anyone can view weeks" ON public.weeks;
CREATE POLICY "Anyone can view weeks" ON public.weeks
  FOR SELECT USING (true);

-- Ensure winners can be viewed by anyone
DROP POLICY IF EXISTS "Anyone can view winners" ON public.winners;
CREATE POLICY "Anyone can view winners" ON public.winners
  FOR SELECT USING (true);

-- STEP 9: Final verification - simulate the app's queries
-- Test the exact query pattern used by the app
SELECT 
    'App Query Test' as test,
    COUNT(*) FILTER (WHERE product_id IS NOT NULL) as votes_with_products
FROM votes;

-- Test a specific product vote count (you'll need to replace with an actual product_id)
-- SELECT COUNT(*) FROM votes WHERE product_id = 'your-product-id-here';

-- STEP 10: Summary of changes
SELECT 'RLS Policies Fixed! The 406 errors should now be resolved.' as message;