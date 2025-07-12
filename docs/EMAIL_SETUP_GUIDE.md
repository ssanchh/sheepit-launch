# Email Setup Guide for Sheep It

## Overview
Sheep It uses two email systems:
1. **Resend** - For transactional emails (welcome, product approved, etc.)
2. **Beehiiv** - For the weekly newsletter

## Current Issues & Solutions

### 1. Email Branding (Fixing the Sheep Icon)
The sheep emoji (🐑) appears in your emails because it's hardcoded in the email template. To replace it with your logo:

#### Option A: Use Your Logo Image
```tsx
// In lib/email/templates/base.tsx, replace line 67:
// OLD:
<h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2D2D2D' }}>
  🐑 Sheep It
</h1>

// NEW:
<img 
  src="https://sheepit.io/logo.png" 
  alt="Sheep It" 
  style={{ height: '40px', width: 'auto' }}
/>
```

#### Option B: Text-Only Logo
```tsx
// Simple text without emoji:
<h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#2D2D2D' }}>
  Sheep It
</h1>
```

### 2. Connecting Users to Beehiiv Newsletter

#### Current Flow:
- When users sign up → They go into your Supabase database
- They receive transactional emails via Resend
- They are NOT automatically subscribed to Beehiiv

#### Recommended Approach:

##### Option 1: Automatic Sync (Recommended)
Add users to Beehiiv when they:
1. Create an account
2. Complete their profile
3. Submit their first product

##### Option 2: Opt-in During Signup
Add a checkbox during registration:
- [ ] Subscribe to weekly newsletter (top products & launch tips)

##### Option 3: Newsletter Component on Site
Use the existing NewsletterSignup component to collect emails

### 3. Implementation Steps

#### Step 1: Add Beehiiv Environment Variables
```env
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=your_publication_id_here
```

#### Step 2: Auto-Subscribe New Users
Add to your signup flow:
```typescript
// In app/auth/callback/route.ts, after user creation:
import { subscribeToNewsletter } from '@/lib/newsletter/beehiiv'

// After successful signup
await subscribeToNewsletter(email, userId, 'signup')
```

#### Step 3: Add Newsletter Preference to Profile
Users should be able to manage their subscription in dashboard settings.

#### Step 4: Sync Existing Users
Run once to sync current users:
```bash
npm run sync-newsletter-subscribers
```

### 4. Email Configuration in Resend

#### Update Email Templates
1. Replace sheep emoji with your logo
2. Ensure consistent branding across all templates
3. Test all email types

#### Email Types to Configure:
- Welcome email (new users)
- Product approved
- Product rejected  
- New comment notification
- Product went live
- Vote milestone reached
- Weekly newsletter (via Beehiiv)

### 5. Best Practices

#### For Transactional Emails (Resend):
- Keep them simple and actionable
- Include clear CTAs
- Always test before sending

#### For Newsletter (Beehiiv):
- Weekly cadence (every Monday)
- Include top 3 products
- Feature maker stories
- Share launch tips

#### User Privacy:
- Always provide unsubscribe options
- Separate preferences for transactional vs marketing
- GDPR compliance with clear consent

### 6. Testing Your Setup

1. **Test Resend Emails:**
   ```bash
   npm run test-email your-email@example.com
   ```

2. **Test Beehiiv Subscription:**
   ```bash
   npm run test-newsletter-subscribe your-email@example.com
   ```

3. **Verify in Dashboards:**
   - Check Resend dashboard for delivery
   - Check Beehiiv for new subscribers

### 7. Newsletter Content Strategy

#### Weekly Newsletter Should Include:
1. **Top 3 Products of the Week**
   - Winner announcement
   - Vote counts
   - Links to products

2. **Upcoming Launches**
   - Preview next week's products
   - Encourage early votes

3. **Maker Spotlight**
   - Interview with a winner
   - Behind the scenes story

4. **Launch Tips**
   - How to get more votes
   - Best practices from winners

### 8. Automation Ideas

1. **Auto-add to Newsletter:**
   - When user completes profile
   - When user submits first product
   - When user wins (special segment)

2. **Segmentation in Beehiiv:**
   - Active makers (submitted products)
   - Voters only
   - Winners circle
   - Premium users

3. **Trigger Emails:**
   - Day before launch reminder
   - Launch day notification
   - Mid-week vote reminder

### Next Steps:
1. Upload your logo to a public URL
2. Update the email template
3. Set up Beehiiv API credentials
4. Test the integration
5. Sync existing users

Need help? Check the API docs:
- [Resend Docs](https://resend.com/docs)
- [Beehiiv API](https://developers.beehiiv.com)