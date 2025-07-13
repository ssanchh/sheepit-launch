# Cleanup Plan - REVIEW BEFORE EXECUTING

## 1. Remove Automatic Beehiiv Sync Code

### Files to modify:
- `/app/auth/callback/route.ts` - Remove automatic newsletter subscription on signup
- `/app/dashboard/page.tsx` - Remove newsletter subscription on profile completion
- `/lib/newsletter/beehiiv.ts` - Simplify to only keep manual export functionality

### API endpoint to remove:
- `/app/api/newsletter/subscribe/` - Entire directory (no longer needed)

## 2. Scripts to Remove (Beehiiv test/debug)

```bash
rm scripts/check-beehiiv.ts
rm scripts/simple-beehiiv-test.ts
rm scripts/test-beehiiv-direct.ts
rm scripts/test-beehiiv.ts
rm scripts/test-subscribe-direct.ts
rm scripts/force-sync-user.ts
rm scripts/process-newsletter-queue.ts  # No longer needed with manual process
rm scripts/newsletter-cron.sh  # No cron needed
rm scripts/run-migration.ts  # One-time use
```

### Scripts to KEEP:
- `scripts/export-emails-for-newsletter.ts` ✅ (main export tool)
- `scripts/check-all-users.ts` ✅ (useful for debugging)
- `scripts/check-recent-signups.ts` ✅ (useful for monitoring)

## 3. Root SQL Files to Remove (One-time fixes)

```bash
rm FIX_AUTH_TO_USERS_TABLE.sql
rm FIX_RLS_CLEAN_FINAL.sql
rm FIX_USERS_RLS_URGENTLY.sql
rm RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql
rm august-launch-setup.sql
rm august-launch-setup-fixed.sql
rm auto-weekly-transition-function.sql
rm check-supabase-auth.sql
rm comment-count-optimization.sql
rm comments-migration.sql
rm database-setup.sql
rm diagnose-and-fix-406.sql
rm fix-votes-clean.sql
rm fix-votes-rls-issue.sql
rm newsletter-email-migration.sql
rm payment-schema-migration.sql
rm product-enhancements-migration.sql
rm product-enhancements.sql
rm weekly-cycle-migration.sql
```

## 4. Temporary Files to Remove

```bash
rm test-email.ts
rm run-tsc.js
rm dev.log
rm tsconfig.tsbuildinfo
rm newsletter-export-2025-07-13.csv
rm weekly-new-signups-2025-07-13.csv
```

## 5. Supabase Cleanup

### Remove SQL files in /supabase/ (not migrations):
```bash
rm supabase/fix-rls-policies.sql
rm supabase/fix-rls-policies-safe.sql
rm supabase/check-tables.sql
rm supabase/fix-rls-final.sql
rm supabase/fix-rls-clean.sql
```

## 6. Database Cleanup

### Tables/triggers to potentially remove:
- `newsletter_subscribers` table - Keep for now (stores email preferences)
- `handle_new_user_newsletter` trigger - Should be removed
- Newsletter-related RLS policies

## Summary

This will:
- Remove ~30 one-time SQL files
- Remove automatic Beehiiv sync (keeping only manual export)
- Clean up test/debug scripts
- Keep only essential functionality

## IMPORTANT: Before executing:
1. Verify all SQL migrations have been applied
2. Back up any CSV exports you want to keep
3. Test that manual export still works after cleanup