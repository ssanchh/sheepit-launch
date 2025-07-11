# Weekly Cycle Automation Setup

This guide explains how to set up automated weekly cycles for Sheep It.

## Overview

The weekly cycle automation handles:
- **Sunday 11 PM**: Close current week, determine winners
- **Monday 12 AM**: Start new week for submissions

## Database Migration

First, run the migration to add necessary columns and functions:

```sql
-- Run the contents of weekly-cycle-migration.sql in your Supabase SQL editor
```

## Option 1: Supabase Edge Functions (Recommended for Production)

### 1. Deploy the Edge Function

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy weekly-cycle
```

### 2. Create Database Triggers

In Supabase SQL editor:

```sql
-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule Sunday night close (11 PM UTC)
SELECT cron.schedule(
  'close-week',
  '0 23 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/weekly-cycle',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('action', 'close_week')
  );
  $$
);

-- Schedule Monday morning start (12 AM UTC)
SELECT cron.schedule(
  'start-week',
  '0 0 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/weekly-cycle',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('action', 'start_week')
  );
  $$
);
```

## Option 2: External Cron Service

If you prefer using an external service like GitHub Actions, Vercel Cron, or cron-job.org:

### GitHub Actions Example

Create `.github/workflows/weekly-cycle.yml`:

```yaml
name: Weekly Cycle

on:
  schedule:
    # Sunday 11 PM UTC
    - cron: '0 23 * * 0'
    # Monday 12 AM UTC
    - cron: '0 0 * * 1'

jobs:
  trigger-cycle:
    runs-on: ubuntu-latest
    steps:
      - name: Determine Action
        id: action
        run: |
          DAY=$(date +%w)
          if [ "$DAY" = "0" ]; then
            echo "ACTION=close_week" >> $GITHUB_OUTPUT
          else
            echo "ACTION=start_week" >> $GITHUB_OUTPUT
          fi
      
      - name: Trigger Weekly Cycle
        run: |
          curl -X POST https://your-app.com/api/trigger-weekly-cycle \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.ADMIN_API_KEY }}" \
            -d '{"action": "${{ steps.action.outputs.ACTION }}"}'
```

### Vercel Cron Example

In `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-cycle",
      "schedule": "0 23 * * 0"
    },
    {
      "path": "/api/cron/weekly-cycle",
      "schedule": "0 0 * * 1"
    }
  ]
}
```

## Manual Testing

For testing, use the Admin panel:

1. Go to `/admin`
2. Navigate to the Analytics tab
3. Find "Weekly Cycle Management" section
4. Use the manual trigger buttons

## Timezone Considerations

- All times are in UTC
- Adjust cron expressions for your target timezone:
  - PST: Add 8 hours (7 during DST)
  - EST: Add 5 hours (4 during DST)
  - Example: For Sunday 11 PM PST → Monday 7 AM UTC: `0 7 * * 1`

## Monitoring

Monitor the weekly cycles by:
1. Checking the `weeks` table for proper creation
2. Verifying `winners` table entries after Sunday close
3. Setting up error notifications in your logging service

## Troubleshooting

1. **No winners created**: Check if products have votes
2. **Week not closing**: Verify there's an active week
3. **Duplicate weeks**: Ensure cron doesn't run multiple times

## Environment Variables

Ensure these are set:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions)
- `ADMIN_API_KEY` (for external cron services)