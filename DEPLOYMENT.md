# Deployment Guide for Sheep It

This guide will help you deploy Sheep It to production so Paddle can review your live website.

## Recommended Deployment Platform: Vercel

Vercel is the easiest option for Next.js apps and offers free hosting for personal projects.

### Step 1: Prepare for Deployment

1. Create a GitHub repository and push your code:
```bash
git add .
git commit -m "Prepare for production deployment"
git remote add origin https://github.com/yourusername/sheep-it.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (copy from `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_REPLY_TO`
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`
   - `NEXT_PUBLIC_SITE_URL` (set to your production URL)
   
5. Click "Deploy"

### Step 3: Configure Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain (e.g., sheepit.io)
3. Follow Vercel's instructions to update DNS records

### Step 4: Update Supabase for Production

1. In Supabase dashboard:
   - Go to Settings → API
   - Add your production domain to "Allowed redirect URLs"
   - Update RLS policies if needed

2. Update your Supabase URL allowlist:
   - Go to Settings → General
   - Add your production domain

### Step 5: Update Email Configuration

1. In Resend:
   - Verify your production domain
   - Update DNS records as instructed

2. Update email URLs in code to use production domain

### Step 6: Pre-Launch Checklist

Before sharing with Paddle:

- [ ] Remove/disable payment buttons temporarily (pricing page shows "Coming Soon")
- [ ] Ensure all pages load without errors
- [ ] Test authentication flow
- [ ] Add sample products to showcase the platform
- [ ] Test newsletter signup
- [ ] Ensure mobile responsiveness

### Alternative: Deploy to Netlify

If you prefer Netlify:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod`
4. Follow prompts to set up environment variables

### Temporary Payment Page

Since payment integration is pending, I've prepared a temporary pricing page that shows "Payment integration coming soon" while keeping the UI intact for Paddle's review.

## Quick Deploy Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel (after linking)
vercel --prod
```

## Important Notes

1. The site is fully functional except for payment processing
2. All UI/UX for payments is visible but shows "coming soon" messages
3. This allows Paddle to review your business model and user flow
4. Once approved, we'll integrate Paddle's payment system

## Support

If you encounter any issues during deployment, check:
- Console for any errors
- Environment variables are correctly set
- Supabase connection is working
- Email configuration is correct