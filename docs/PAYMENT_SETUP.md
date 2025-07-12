# Lemon Squeezy Payment Setup Guide

## Quick Setup (5 minutes)

### 1. Create Lemon Squeezy Account
1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Sign up for an account
3. Complete your store setup

### 2. Create Products
In your Lemon Squeezy dashboard:

1. **Skip Queue Product**
   - Name: "Skip Queue - Sheep It"
   - Price: $35
   - Type: One-time payment
   - Note the Product ID

2. **Featured Product**
   - Name: "Featured Listing - Sheep It"
   - Price: $45
   - Type: One-time payment
   - Note the Product ID

### 3. Get API Credentials
1. Go to Settings → API
2. Create a new API key
3. Copy your Store ID and API Key

### 4. Set up Webhook
1. Go to Settings → Webhooks
2. Add endpoint: `https://sheepit.io/api/webhooks/lemon-squeezy`
3. Select events:
   - `order_created`
   - `order_refunded`
4. Copy the Webhook Secret

### 5. Add to .env.local
```
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID=variant_id_from_product_1
LEMON_SQUEEZY_FEATURED_VARIANT_ID=variant_id_from_product_2
```

## Testing
1. Use test mode in Lemon Squeezy
2. Test card: 4242 4242 4242 4242
3. Any future expiry and CVC

That's it! The payment system is now ready to use.