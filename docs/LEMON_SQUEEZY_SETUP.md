# Lemon Squeezy Payment Integration Setup

This guide will help you set up Lemon Squeezy payments for Sheep It once your account is approved.

## 1. Lemon Squeezy Account Setup

After your Lemon Squeezy account is approved:

1. Log in to your Lemon Squeezy dashboard
2. Navigate to **Settings > API** to get your API key
3. Navigate to **Settings > Webhooks** to set up webhook endpoint

## 2. Create Products

You need to create two products in Lemon Squeezy:

### Product 1: Premium Launch - Skip the Queue
- **Name**: Premium Launch - Skip the Queue
- **Price**: $35 USD
- **Type**: One-time payment
- **Description**: Skip the queue and launch next Monday

### Product 2: Featured Product Spot
- **Name**: Featured Product Spot
- **Price**: $30 USD
- **Type**: One-time payment
- **Description**: Premium placement at the top of the homepage for one week

## 3. Set Up Webhook

1. In Lemon Squeezy, go to **Settings > Webhooks**
2. Click **Add webhook**
3. Set the URL to: `https://your-domain.com/api/webhooks/lemon-squeezy`
4. Select these events:
   - `order_created`
   - `order_refunded`
5. Copy the signing secret

## 4. Environment Variables

Add these to your `.env.local` file:

```env
# Lemon Squeezy Store ID (from your dashboard)
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=your_store_id

# Product IDs (from the products you created)
NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_PRODUCT_ID=prod_xxxxx
NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID=var_xxxxx

NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_PRODUCT_ID=prod_xxxxx
NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_VARIANT_ID=var_xxxxx

# API Key (from Settings > API)
LEMON_SQUEEZY_API_KEY=your_api_key

# Webhook Secret (from the webhook you created)
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

## 5. Update Checkout URL

In `/lib/lemon-squeezy.ts`, update line 57 to use your actual store URL:
```typescript
const checkoutUrl = new URL('https://YOUR-STORE.lemonsqueezy.com/checkout/buy/' + productConfig.variantId)
```

## 6. Test the Integration

1. Make a test purchase using Lemon Squeezy's test mode
2. Verify the webhook is received at `/api/webhooks/lemon-squeezy`
3. Check that the payment record is created in Supabase
4. Verify the queue skip or featured product is applied

## 7. Production Checklist

Before going live:
- [ ] Run the payment schema migration in Supabase
- [ ] Set all environment variables in production
- [ ] Update the checkout URL with your actual store URL
- [ ] Test webhook endpoint is accessible
- [ ] Enable Lemon Squeezy live mode
- [ ] Update DNS if using custom domain for checkout

## Payment Flow

1. User clicks "Choose Premium" or "Get Featured" on pricing page
2. System creates a pending payment record in database
3. User is redirected to Lemon Squeezy checkout
4. After successful payment, Lemon Squeezy sends webhook
5. Webhook handler updates payment status and applies the purchased feature
6. User sees confirmation and their product is updated accordingly

## Troubleshooting

- **Webhook not received**: Check your webhook URL is publicly accessible
- **Invalid signature**: Verify your webhook secret is correct
- **Payment not applied**: Check Supabase logs and webhook processing errors
- **Checkout fails**: Verify all product IDs and variant IDs are correct