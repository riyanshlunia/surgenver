# 🚀 Quick Start Guide - Certificate Pro

## ✅ What's Done (Hour 1 Complete!)

- ✅ Next.js 15 with TypeScript, Tailwind, ESLint
- ✅ shadcn/ui components installed (Button, Card, Input, Table, etc.)
- ✅ Dark mode dashboard ready
- ✅ Project structure created
- ✅ Supabase integration setup
- ✅ Cloudinary helper functions
- ✅ All pages created:
  - Landing page with hero section
  - Admin dashboard
  - Template configuration page
  - CSV bulk upload page
  - Participant portal with glassmorphism
  - Verification page with green/red badges

## 📋 Next Steps (Your To-Do)

### Immediate (Before coding):

1. **Setup Supabase** (5 minutes)
   - Go to https://supabase.com
   - Create new project
   - Copy SQL from `supabase-schema.sql`
   - Paste in SQL Editor and run
   - Copy URL and keys to `.env.local`

2. **Setup Cloudinary** (5 minutes)
   - Go to https://cloudinary.com
   - Sign up / Login
   - Get Cloud Name, API Key, API Secret
   - Add to `.env.local`

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

### Hour 2: CSV Upload Implementation
- Open `src/app/admin/upload/page.tsx`
- Implement the `handleGenerateCertificates` function
- Call Supabase to insert records

### Hour 3: Cloudinary Integration
- Test Cloudinary text overlay in `src/lib/cloudinary.ts`
- Upload a sample certificate template to Cloudinary
- Test the URL generation with a real template

### Hour 4: Verification System
- The verification page is ready at `src/app/verify/[id]/page.tsx`
- Test with real data from Supabase
- Add QR code generation using the `qrcode` library

## 📂 Files You'll Edit Most:

1. **`.env.local`** - Add your API keys
2. **`src/app/admin/upload/page.tsx`** - Bulk certificate generation logic
3. **`src/app/admin/template/page.tsx`** - Save template to Cloudinary + Supabase
4. **`src/lib/cloudinary.ts`** - Test and refine URL generation
5. **`src/lib/supabase.ts`** - Add helper functions for CRUD operations

## 🎨 Routes Available:

- `/` - Landing page
- `/admin` - Dashboard
- `/admin/template` - Configure certificate template
- `/admin/upload` - Bulk CSV upload
- `/portal` - Participant search portal
- `/verify/[uuid]` - Certificate verification

## 💡 Pro Tips:

1. **Test Cloudinary first**: Upload a test image and try the transformation URL in browser
2. **Use the sample CSV**: `sample-participants.csv` is ready for testing
3. **Font families available**: Roboto, Arial, Times, Courier (add more in Cloudinary settings)
4. **Verification is server-side**: The verify page uses Server Components for security

## 🐛 Common Issues:

**Issue**: Supabase connection fails
- **Fix**: Make sure you copied the correct URL and anon key

**Issue**: Cloudinary image doesn't show text
- **Fix**: Check that the public_id matches exactly, including folder paths

**Issue**: CSV parsing fails
- **Fix**: Ensure CSV has headers: `name,email` (lowercase)

## 📦 Packages Installed:

- `papaparse` - CSV parsing
- `qrcode` - QR code generation
- `uuid` - Generate unique IDs
- `@supabase/supabase-js` - Database
- `cloudinary` - Image transformations

## 🚀 Deployment Ready:

When ready to deploy:
```bash
npm run build
```

Deploy to Vercel:
```bash
npx vercel
```

---

## 🎯 Current Status:

**Completed**: Project setup, UI components, page structure, integrations setup
**Next**: Configure your API keys and start implementing the business logic!

Good luck with your hackathon! 🏆
