# Troubleshooting 406 Errors on sheepit.io

## Issue Summary
The production app is returning 406 errors when trying to access Supabase endpoints, specifically for the votes table.

## Root Cause
The 406 error typically indicates one of the following:
1. **RLS (Row Level Security) policies are blocking access** - Most likely cause
2. The Supabase project is paused or has exceeded limits
3. CORS configuration issues
4. Authentication token problems

## Immediate Solutions

### 1. Fix RLS Policies for Votes Table

The current RLS policy only allows users to see their own votes, but the app needs to count all votes for products. Run this SQL in your Supabase SQL Editor:

```sql
-- Fix 406 errors on votes table by updating RLS policies
-- This allows anonymous users to count votes on products

-- First, drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own votes" ON public.votes;

-- Create a new policy that allows anyone to view votes
-- This is necessary for counting votes on product pages
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

-- Also ensure these policies exist for proper voting functionality
CREATE POLICY IF NOT EXISTS "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own votes" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Verify All Tables Have Proper RLS Policies

Run the complete RLS fix script from `/supabase/fix-rls-final.sql` to ensure all tables have the correct policies.

### 3. Check Supabase Project Status

1. Log into your Supabase dashboard
2. Check if the project is active (not paused)
3. Verify you haven't exceeded any rate limits or quotas
4. Check the project's API settings

### 4. Verify Environment Variables

Ensure your production environment has the correct values:
- `NEXT_PUBLIC_SUPABASE_URL` - Should match your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Should be the anon/public key from Supabase

### 5. Debug the Actual Error

To see the full error response, you can:

1. Open Chrome DevTools on sheepit.io
2. Go to Network tab
3. Find a failing request (406 status)
4. Click on it and check:
   - Response headers
   - Response body (this often contains the specific RLS policy that failed)

### 6. Test Queries Directly

Test the queries in Supabase SQL Editor to verify they work:

```sql
-- Test if votes can be selected
SELECT * FROM votes LIMIT 10;

-- Test counting votes for a product (replace with actual product_id)
SELECT COUNT(*) FROM votes WHERE product_id = 'some-uuid-here';

-- Check current RLS policies on votes table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'votes'
ORDER BY policyname;
```

## Additional Debugging Steps

### Check CORS Configuration

The 406 error is unlikely to be CORS-related, but if you see CORS errors:

1. In Supabase Dashboard → Settings → API
2. Verify your domain is allowed in CORS settings
3. Ensure `https://sheepit.io` is in the allowed origins

### Verify Anonymous Access

Some queries might be made before user authentication. Ensure:

1. The anon key is correctly set in production
2. RLS policies allow anonymous access where needed (like viewing vote counts)

### Check for Service Disruptions

1. Check Supabase status page: https://status.supabase.com/
2. Look for any ongoing incidents

## Long-term Solution

Consider implementing error boundaries and better error handling in the app to provide more informative error messages when Supabase queries fail.

## Verification

After applying the fixes, verify:

1. Product pages load without errors
2. Vote counts are displayed correctly
3. Authenticated users can vote
4. The Network tab shows 200 OK responses for Supabase requests