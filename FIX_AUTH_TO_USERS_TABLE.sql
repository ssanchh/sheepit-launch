-- CRITICAL FIX: Create users table entry when auth user is created
-- Run this in Supabase SQL Editor IMMEDIATELY

-- 1. Create function to handle new auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT USAGE ON SCHEMA auth TO service_role;

-- 4. Fix any existing auth users that don't have a users table entry
INSERT INTO public.users (id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.created_at as updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- 5. Verify the fix
SELECT 
  'Auth users:' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Public users:' as table_name,
  COUNT(*) as count
FROM public.users;

-- 6. Check if your user exists in both tables
SELECT 
  'Your auth user:' as status,
  id,
  email
FROM auth.users
WHERE email = 'ssanchezgoni01@gmail.com'
UNION ALL
SELECT 
  'Your public user:' as status,
  id,
  email
FROM public.users
WHERE email = 'ssanchezgoni01@gmail.com';