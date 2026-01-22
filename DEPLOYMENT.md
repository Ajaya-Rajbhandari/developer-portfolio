# Deployment Guide - Sanity CMS Portfolio

This guide will help you deploy your portfolio with Sanity CMS to production.

## Prerequisites

✅ Your Sanity project is set up (Project ID: `48v38ttl`)  
✅ Content is published in Sanity Studio  
✅ Local development is working  

## Step 1: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Sanity CMS integration"
   git push
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Configure Environment Variables**:
   - In project settings, go to "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SANITY_PROJECT_ID=48v38ttl
     NEXT_PUBLIC_SANITY_DATASET=production
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development** environments
   - Click "Save"

4. **Deploy**:
   - Vercel will automatically detect Next.js
   - Click "Deploy"
   - Wait for build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add:
     - `NEXT_PUBLIC_SANITY_PROJECT_ID=48v38ttl`
     - `NEXT_PUBLIC_SANITY_DATASET=production`

4. **For production**:
   ```bash
   vercel --prod
   ```

## Step 2: Configure Sanity CORS (Important!)

Your Sanity project needs to allow requests from your production domain.

1. **Go to Sanity Manage**:
   - Visit [sanity.io/manage](https://www.sanity.io/manage)
   - Select your project (Portfolio CMS)

2. **Add CORS Origins**:
   - Go to **Settings** → **API** → **CORS origins**
   - Click **"Add CORS origin"**
   - Add your production URL:
     - **Origin**: `https://your-domain.vercel.app` (or your custom domain)
     - **Credentials**: ✅ Check this
     - **Allow credentials**: ✅ Check this
   - Click **"Save"**

3. **For localhost (if needed)**:
   - Also add: `http://localhost:3000`
   - With credentials enabled

## Step 3: Verify Production Build

Before deploying, test the production build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and verify:
- ✅ Projects load from Sanity
- ✅ Images display correctly
- ✅ No console errors

## Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Sanity CORS**:
   - Add your custom domain to Sanity CORS origins
   - Example: `https://yourname.com`

## Step 5: Environment Variables Checklist

Make sure these are set in your hosting platform:

### Required:
- ✅ `NEXT_PUBLIC_SANITY_PROJECT_ID=48v38ttl`
- ✅ `NEXT_PUBLIC_SANITY_DATASET=production`

### Optional (if you add more features):
- `SANITY_API_READ_TOKEN` (for private content)
- `SANITY_API_WRITE_TOKEN` (for mutations)

## Troubleshooting

### Content Not Showing in Production?

1. **Check Environment Variables**:
   - Verify they're set correctly in Vercel
   - Make sure they're added for **Production** environment
   - Redeploy after adding variables

2. **Check Sanity CORS**:
   - Verify your production URL is in CORS origins
   - Check browser console for CORS errors

3. **Check Build Logs**:
   - In Vercel dashboard, check build logs
   - Look for any errors during build

4. **Verify Content is Published**:
   - Go to Sanity Studio
   - Make sure content shows "Published" status
   - Not just "Draft"

### Images Not Loading?

- ✅ Already fixed in `next.config.ts` (cdn.sanity.io is configured)
- If using custom domain, no additional config needed

### Build Errors?

- Check that all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`
- Check for any missing environment variables

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables set in Vercel
- [ ] Sanity CORS configured for production domain
- [ ] Production build tested locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Verified content loads in production
- [ ] Custom domain configured (if applicable)

## Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Sanity Docs**: [sanity.io/docs](https://www.sanity.io/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
