# Webhook Setup for Lemon Squeezy

## Local Testing with ngrok

Since you're in development, you'll need to use ngrok to expose your local webhook endpoint:

1. **Install ngrok** (if you haven't already):
   ```bash
   brew install ngrok
   ```

2. **Start your Next.js app**:
   ```bash
   npm run dev
   ```

3. **In a new terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** that ngrok provides (e.g., `https://abc123.ngrok.io`)

## Create Webhook in Lemon Squeezy

1. Go to **Settings → Webhooks** in Lemon Squeezy
2. Click **"Add webhook"**
3. Fill in:
   - **URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/lemon-squeezy`
   - **Description**: Sheep It Payment Webhook
   - **Events**: Select these:
     - `order_created`
     - `order_refunded`
4. Click **"Save webhook"**
5. **Copy the signing secret** that appears

## Update your .env.local

Add these values to your `.env.local` file:

```env
# Store ID
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=200218

# Test Mode Product IDs
NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_PRODUCT_ID=574430
NEXT_PUBLIC_LEMON_SQUEEZY_SKIP_QUEUE_VARIANT_ID=895266
NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_PRODUCT_ID=574433
NEXT_PUBLIC_LEMON_SQUEEZY_FEATURED_VARIANT_ID=895269

# API Key (Test)
LEMON_SQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI3YTYwYTFhZDg4NTFkMDFhOGM3YWY4ZjZiN2IwMGUzY2ViNDQ5NzFhZDA3N2M4Y2Q4YmJkOWRhMTAxMDhlOTYzNzMyNzU5M2EzNDUxZmE5MCIsImlhdCI6MTc1MjE2NDk5MS4zMTgxMTUsIm5iZiI6MTc1MjE2NDk5MS4zMTgxMTgsImV4cCI6MjA2NzY5Nzc5MS4yOTA3NzYsInN1YiI6IjQzNTEyMzYiLCJzY29wZXMiOltdfQ.JdFZbttfTYFyjyrc5P274DpHShETk7g14VI75geG9dM4BSk840sl_Iw4cQ370KjW9RN0Ev4j_DkVF5_HpC254y0w330E0btvPuZYam-McTR9cAphCgRp8HjVlY2jaWi_Ks_wBSttkA6XOanMOzINJpXHQxvaDmToKJD3TaS2t7dcrjl3SOLJeeVF0M-C45SCm1P_S7HUod2JQAxebvCki4_m07vCzNrNta9CimN6UKg38AHEGeERK8foRBP4uqxXWrjL9dBrTeRJkvS0dJ3fBPb6VsfIfRCK61rm-A_TeH4eY7GOWqKO1DknwzCiuHr_oqv22QWKCNph02Uof6a8CzQHX6gLKsoPF8jtavYvpQTOwT4xT1WkFTOofujDcMfLwlNrYAvXiAZH5R2OZpCrrEV-xShdlSnstMbxcAMIlvnnWTflmeB7BDVURvhluMGkOUVvDXizM-H6iXZup91KWRV84COiN3ZLTAMKgBHsbQQZY1GHnhm4nM9XLC7XxMaa

# Webhook Secret (you'll get this after creating the webhook)
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Test the Integration

1. Make sure ngrok is running and your app is running
2. Go to your pricing page: `http://localhost:3000/pricing`
3. Click "Choose Premium" or "Get Featured"
4. You should be redirected to Lemon Squeezy checkout
5. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
6. Check your terminal for webhook logs

## Important Notes

- **ngrok URL changes** each time you restart it, so you'll need to update the webhook URL in Lemon Squeezy
- **Test mode** transactions don't charge real money
- **Store URL**: Your store URL appears to be `sheepit.lemonsqueezy.com` (not sheepitapp)
- When you go live, you'll need to:
  1. Create new products in live mode
  2. Get a new API key for live mode
  3. Update all the IDs in your `.env.local`