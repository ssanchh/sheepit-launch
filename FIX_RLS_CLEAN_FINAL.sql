-- CLEAN UP RLS POLICIES FOR USERS TABLE
-- This removes duplicates and ensures proper policies

-- 1. Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- 2. Create clean, non-conflicting policies
-- Allow users to see their own profile always
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow anyone to see completed profiles (public profiles)
CREATE POLICY "Public profiles are viewable" ON public.users
  FOR SELECT USING (profile_completed = true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (shouldn't be needed with trigger, but just in case)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Verify the policies are clean
SELECT 
  policyname,
  cmd,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 4. Test that your user can update their profile
-- This should return your user data
SELECT id, email, profile_completed 
FROM public.users 
WHERE id = auth.uid();