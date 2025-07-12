# Feature Implementation Plan for New Pricing Structure

## Overview
Based on the competitive analysis, we need to implement the following features to support our new pricing model.

## Database Changes Required

### 1. Products Table Updates
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_duration INTEGER DEFAULT 7;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured_rotation BOOLEAN DEFAULT FALSE;
```

### 2. Featured Rotation System
```sql
CREATE TABLE IF NOT EXISTS featured_rotation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  rotation_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Feature Implementation Tasks

### 1. **Multiple Days Homepage Display** ✅ Already Implemented
- Products already show for 7 days on homepage
- Voting system already in place

### 2. **Top 3 Ranking System** ✅ Already Implemented
- Weekly winners already tracked in `winners` table
- Badges already created and functional

### 3. **Guaranteed Backlinks for Premium** 🔧 Needs Implementation
- Add automatic backlink generation for premium products
- Create a dedicated backlinks page/section
- Track backlink status in database

### 4. **Featured Product Rotation** 🔧 Needs Implementation
- Create rotation algorithm to show different featured products
- Implement on every page load
- Track impressions for featured products

### 5. **Cancel Anytime for Featured** 🔧 Needs Implementation
- Add subscription management
- Create cancel functionality
- Pro-rate refunds if needed

## Code Changes Needed

### 1. Homepage Component Update
```typescript
// Add featured rotation logic
const getFeaturedProduct = async () => {
  // Randomly select from active featured products
  const featured = await supabase
    .from('featured_rotation')
    .select('*, products(*)')
    .eq('is_active', true)
    .gte('end_date', new Date().toISOString())
    .order('rotation_order')
    .limit(1)
    .single()
  
  return featured
}
```

### 2. Backlinks Page
Create `/app/backlinks/page.tsx` to display all products with guaranteed backlinks

### 3. Payment Integration Updates
- Update Lemon Squeezy products to $30/week for featured
- Add subscription support for featured products
- Implement cancel subscription webhook

### 4. Analytics Updates
- Track featured product impressions
- Show rotation statistics
- Monitor conversion rates

## Priority Order

1. **High Priority**
   - Update pricing to $30/week for featured
   - Implement featured product rotation
   - Create backlinks page

2. **Medium Priority**
   - Add subscription cancellation
   - Enhanced analytics for featured products
   - Automatic backlink generation

3. **Low Priority**
   - A/B testing for rotation algorithm
   - Advanced analytics dashboard
   - Email notifications for featured products

## Estimated Timeline
- Database changes: 30 minutes
- Featured rotation: 2 hours
- Backlinks page: 1 hour
- Payment updates: 1 hour
- Testing: 1 hour

Total: ~5-6 hours of implementation