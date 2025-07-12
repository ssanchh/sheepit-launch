# Sheep It Launch Checklist

## 1. Lemon Squeezy Setup
- [ ] Create Lemon Squeezy account at https://lemonsqueezy.com
- [ ] Create two products:
  - Skip Queue ($35)
  - Featured Product ($45)
- [ ] Add webhook endpoint: `https://sheepit.io/api/webhooks/lemon-squeezy`
- [ ] Copy API credentials to `.env.local`

## 2. Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_WEBHOOK_SECRET=
```

## 3. Database Setup
Run these SQL commands in Supabase SQL editor:

```sql
-- Create first week (adjust date as needed)
INSERT INTO weeks (id, start_date, end_date, status)
VALUES (
  gen_random_uuid(),
  '2025-08-04'::date,
  '2025-08-10'::date,
  'upcoming'
);

-- Make yourself admin (replace with your email)
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## 4. Deploy Edge Functions
```bash
cd supabase/functions
supabase functions deploy weekly-cycle-trigger
```

## 5. Set up Cron Jobs
In Supabase Dashboard > Database > Extensions, enable pg_cron, then:

```sql
-- Close week on Sunday 11:59 PM
SELECT cron.schedule(
  'close-week',
  '59 23 * * 0',
  $$SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/weekly-cycle-trigger',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{"action": "close"}'::jsonb
  );$$
);

-- Start new week on Monday 12:01 AM
SELECT cron.schedule(
  'start-week',
  '1 0 * * 1',
  $$SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/weekly-cycle-trigger',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{"action": "start"}'::jsonb
  );$$
);
```

## 6. Test Everything
- [ ] Sign up as a new user
- [ ] Complete profile
- [ ] Submit a product
- [ ] Approve it in admin panel
- [ ] Test skip queue payment
- [ ] Test featured product payment
- [ ] Verify emails are sent

## 7. Go Live!
- [ ] Announce on Twitter
- [ ] Share in founder communities
- [ ] Monitor first submissions