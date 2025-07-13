# Weekly Newsletter Process

## Every Sunday Before Sending Newsletter:

### 1. Export Email List
```bash
cd "/Users/santiagosanchez/Desktop/Sheep It"
npx tsx scripts/export-emails-for-newsletter.ts
```

This creates two files:
- `newsletter-export-[date].csv` - All active users
- `weekly-new-signups-[date].csv` - Just this week's new signups

### 2. Import to Beehiiv
1. Go to [Beehiiv Dashboard](https://app.beehiiv.com)
2. Navigate to **Subscribers** → **Import**
3. Upload the CSV file (use weekly file if you already have most subscribers)
4. Beehiiv automatically handles duplicates

### 3. Send Newsletter
1. Create your newsletter in Beehiiv
2. Send to all subscribers

## That's it! 🎉

### Notes:
- The export includes only users with completed profiles
- Beehiiv is your "source of truth" for unsubscribes
- Users who unsubscribe in Beehiiv won't be re-added (Beehiiv remembers them)
- This whole process takes ~5 minutes per week

### Why This Works:
- Dead simple, no complex syncing
- You see exactly who's being added
- Beehiiv handles all compliance (unsubscribes, bounces, etc.)
- No mysterious failures or pending states