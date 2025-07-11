-- Check if the issue is with authentication/API access
-- Run each section separately to diagnose

-- 1. Check if anon key has proper permissions
SELECT 
    rolname,
    rolcanlogin,
    rolreplication,
    rolbypassrls
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role');

-- 2. Check current user/role
SELECT current_user, current_role;

-- 3. Test direct table access
SELECT COUNT(*) FROM public.votes;
SELECT COUNT(*) FROM public.products;
SELECT COUNT(*) FROM public.users;

-- 4. Check if tables have any RLS policies at all
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 5. Check if RLS is actually enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;