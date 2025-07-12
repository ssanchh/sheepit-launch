# Sheep It Launch Guide 🚀

## Pre-Launch Checklist

### 1. Lemon Squeezy Setup (5 minutes)
- [ ] Create account at [lemonsqueezy.com](https://lemonsqueezy.com)
- [ ] Create two products: "Skip Queue" ($35) and "Featured" ($45)
- [ ] Get your Store ID, API Key, and Product IDs
- [ ] Set up webhook to `https://sheepit.io/api/webhooks/lemon-squeezy`
- [ ] Copy all credentials to `.env.local`

### 2. Database Setup (2 minutes)
- [ ] Run the SQL script in Supabase SQL Editor:
```sql
-- From supabase/migrations/002_initial_setup.sql
```
- [ ] Make yourself admin:
```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in all values:
```bash
cp .env.example .env.local
```

### 4. Deploy Edge Functions (if using cron jobs)
```bash
cd supabase/functions
supabase functions deploy weekly-cycle-trigger
```

### 5. Final Tests
- [ ] Sign up with a test account
- [ ] Submit a test product
- [ ] Approve it from admin panel
- [ ] Test voting works
- [ ] Test payment flow (use Lemon Squeezy test mode)

## Launch Day

1. **Announce on Twitter/X**
   - Tag @sheepit_io
   - Use #buildinpublic #indiehackers

2. **Share in Communities**
   - Indie Hackers
   - Product Hunt (discussions)
   - Relevant Slack/Discord communities

3. **Monitor**
   - Check Supabase logs
   - Monitor payment webhooks
   - Be ready to approve products quickly

## Post-Launch

- Set up weekly email notifications
- Create social media templates for winners
- Consider adding more payment options

Good luck with your launch! 🎉