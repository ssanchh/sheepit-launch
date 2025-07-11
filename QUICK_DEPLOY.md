# Quick Deploy Guide for Sheep It

This guide will help you get Sheep It live quickly for Paddle's review.

## Option 1: Deploy to Vercel (Recommended - 5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Copy ALL environment variables from `.env.local` to Vercel
5. Click "Deploy"

### 3. Update Production URLs
After deployment, update these in Vercel's environment variables:
- `NEXT_PUBLIC_SITE_URL` = Your Vercel URL (e.g., https://sheep-it.vercel.app)

## Option 2: Deploy with Vercel CLI (3 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts to set environment variables
```

## Important Notes for Paddle Review

1. **Payment buttons are temporarily disabled** - They show "Coming Soon" messages
2. **All UI/UX is functional** - Paddle can see the complete user flow
3. **Sample data** - Add a few test products to showcase the platform
4. **Test accounts** - Create test users to demonstrate voting

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Authentication works (try logging in)
- [ ] Homepage shows products (add test products if needed)
- [ ] Pricing page displays correctly with "Coming Soon" buttons
- [ ] Mobile responsive (test on phone)

## Need Help?

Common issues:
- **Build fails**: Check for TypeScript errors with `npm run build`
- **Auth not working**: Verify Supabase URLs in environment variables
- **No products showing**: Add test products via the submit page

Once live, share your URL with Paddle for review!