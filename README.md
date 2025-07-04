# 🐑 Sheep It - Weekly Launchpad for Indie Startups

A modern web application built with Next.js 14 that serves as a weekly product launch and discovery platform for indie startups, solo founders, and builders.

## 🚀 Features

- **Weekly Product Launches**: Submit your product for the current week
- **Community Voting**: Users can vote on their favorite products (1 vote per product per week)
- **Authentication**: Magic link (email) and Google OAuth integration
- **Product Submission**: Rich form with logo upload, video links, and detailed descriptions
- **Admin Panel**: Approve/reject submissions before they go live
- **Winner Selection**: Top 3 products each week get badges and promotion
- **Partner Newsletter**: Automated winner data for newsletter integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Email**: Resend API
- **File Upload**: Supabase Storage
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
sheep-it/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── login/             # Authentication pages
│   ├── submit/            # Product submission
│   ├── weekly/            # Weekly board (coming soon)
│   ├── admin/             # Admin panel (coming soon)
│   └── auth/              # Auth callback handlers
├── components/            # Reusable components (to be created)
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # Authentication hook
├── lib/                   # Utilities and configurations
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database schema types
└── public/               # Static assets
```

## 🗄️ Database Schema

### Tables

1. **users** - User profiles (extends Supabase auth)
2. **products** - Product submissions
3. **weeks** - Weekly cycles (Monday-Sunday)
4. **votes** - User votes on products
5. **winners** - Weekly top 3 products
6. **partners** - Newsletter partners

### Key Features

- **Weekly Cycles**: Products compete within Monday-Sunday windows
- **Approval System**: All submissions require admin approval
- **Vote Constraints**: One vote per user per product per week
- **Logo Storage**: Supabase Storage for product logos

## 🔧 Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   git clone <repo-url>
   cd sheep-it
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Database Setup**:
   Run the following SQL in your Supabase dashboard:
   
   ```sql
   -- Create tables
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     email VARCHAR NOT NULL,
     full_name VARCHAR,
     avatar_url VARCHAR,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE weeks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(50) NOT NULL,
     tagline VARCHAR(120) NOT NULL,
     description TEXT NOT NULL,
     website_url VARCHAR NOT NULL,
     logo_url VARCHAR,
     video_url VARCHAR,
     created_by UUID NOT NULL REFERENCES users(id),
     week_id UUID NOT NULL REFERENCES weeks(id),
     approved BOOLEAN DEFAULT false,
     featured BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE votes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     product_id UUID NOT NULL REFERENCES products(id),
     week_id UUID NOT NULL REFERENCES weeks(id),
     created_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(user_id, product_id, week_id)
   );

   CREATE TABLE winners (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id UUID NOT NULL REFERENCES products(id),
     week_id UUID NOT NULL REFERENCES weeks(id),
     position INTEGER NOT NULL CHECK (position IN (1, 2, 3)),
     badge_url VARCHAR,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE partners (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR NOT NULL,
     name VARCHAR NOT NULL,
     newsletter_name VARCHAR NOT NULL,
     utm_source VARCHAR NOT NULL,
     active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Storage Setup**:
   Create a storage bucket named `product-logos` in Supabase with public access.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📱 Current Implementation Status

### ✅ Completed Features

- [x] Project structure and configuration
- [x] Authentication system (magic link + Google OAuth)
- [x] Homepage with modern design
- [x] Product submission form with file upload
- [x] Database schema and types
- [x] Form validation with Zod
- [x] Responsive design with Tailwind CSS

### 🚧 Next Steps

- [ ] Weekly board page (`/weekly`)
- [ ] Voting system
- [ ] Dashboard for user submissions
- [ ] Admin panel for approvals
- [ ] Winner selection and badges
- [ ] Email notifications (Resend)
- [ ] Archive pages for past winners
- [ ] Cron job for weekly cycles

## 🚀 Deployment

The app is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

## 🎯 Key Design Decisions

1. **Weekly Cycles**: Monday-Sunday cycles create urgency and regular engagement
2. **Approval System**: Prevents spam and maintains quality
3. **Vote Limits**: One vote per user per product ensures fair competition
4. **Modern UI**: Clean, professional design that appeals to indie makers
5. **File Upload**: Supabase Storage for reliable image hosting

## 🔐 Security Features

- Row Level Security (RLS) policies in Supabase
- File upload validation (size, type)
- Form validation with Zod
- Protected routes with authentication
- Input sanitization

## 📝 Contributing

This is an MVP focused on core functionality. Future enhancements could include:

- Advanced analytics dashboard
- Email digest for community
- Integration with social media
- API for third-party integrations
- Mobile app
- Featured product slots (monetization)

## 📄 License

This project is part of the Sheep It platform development. 