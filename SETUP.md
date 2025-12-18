# Setup Instructions

## 1. Supabase Setup (Required)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → API
4. Copy these values to your `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to SQL Editor and run the schema from `supabase-schema.sql`

## 2. Cloudinary Setup (Required)

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Go to Dashboard
3. Copy these values to your `.env.local`:
   - Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

## 3. Resend Setup (Optional - for email)

1. Go to [resend.com](https://resend.com) and create account
2. Create API key
3. Add to `.env.local`:
   - `RESEND_API_KEY=re_xxxxx`
   - `RESEND_FROM_EMAIL=certificates@yourdomain.com`

## 4. Update .env.local

Replace all `your_xxx_here` placeholders with actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop

NEXT_PUBLIC_APP_URL=http://localhost:3001

RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=certificates@yourdomain.com
```

## 5. Restart Dev Server

```bash
npm run dev
```

## Current Error

The "Failed to fetch events" error means your Supabase credentials aren't configured yet. Follow steps 1-4 above to fix it.
