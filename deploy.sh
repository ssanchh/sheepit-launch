#!/bin/bash

echo "🚀 Preparing Sheep It for deployment..."

# Check if all environment variables are set
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your production environment variables"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your GitHub repo to Vercel"
    echo "3. Add environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed. Please fix any errors and try again."
    exit 1
fi