# Database Migrations to Run

Please run these SQL migrations in your Supabase SQL Editor in this order:

## 1. Product Enhancements (if not already run)
File: `product-enhancements.sql`
- Adds featured_image_url, team_type, primary_goal, and categories fields to products table

## 2. Product Screenshots and Social Links
File: `product-enhancements-migration.sql`
- Adds screenshot_urls array field for multiple product screenshots
- Adds twitter_url field for social media links  
- Adds view_count field with tracking function
- Creates increment_product_views function for analytics

## 3. Weekly Cycle Automation (if not already run)
File: `weekly-cycle-migration.sql`
- Sets up automated weekly competition cycles
- Creates views and functions for managing week transitions

## After running migrations:
1. The submit form now supports:
   - Multiple product screenshots (up to 3)
   - Twitter/X profile links
   - View count tracking

2. The product detail page now displays:
   - Screenshot gallery
   - Twitter link button
   - View count
   - All the enhanced product information

3. Make sure to create the Supabase Edge Function for weekly automation as described in the weekly-cycle-migration.sql comments.