-- Fix 406 errors on votes table by updating RLS policies
-- This allows anonymous users to count votes on products

-- First, drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own votes" ON public.votes;

-- Create a new policy that allows anyone to view votes
-- This is necessary for counting votes on product pages
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

-- Verify the policies are correct
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;