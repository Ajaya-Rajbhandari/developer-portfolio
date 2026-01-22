# Sanity CMS Setup Guide

This portfolio now supports Sanity CMS for content management. You can manage your projects, skills, experience, and personal information through Sanity's admin panel.

## Quick Start

### 1. Create a Sanity Account

1. Go to [sanity.io](https://www.sanity.io)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Project Credentials

After creating a project, you'll get:
- **Project ID**: Found in your project settings
- **Dataset**: Usually "production" (default)

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Sanity credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

### 4. Deploy Sanity Schema

Run this command to deploy your schema to Sanity:

```bash
npx sanity init --env
```

Or manually deploy using Sanity CLI:

```bash
npm install -g @sanity/cli
sanity init
sanity deploy
```

### 5. Access Sanity Studio

You can access Sanity Studio in two ways:

**Option A: Online Studio (Recommended)**
- Go to [sanity.io/manage](https://www.sanity.io/manage)
- Select your project
- Start adding content!

**Option B: Local Studio**
Create a `sanity/studio` directory and run:
```bash
npx sanity dev
```

## Content Types

### Projects
- **Name**: Project title
- **Slug**: URL-friendly identifier (auto-generated)
- **Description**: Project description
- **Image**: Project screenshot/image
- **Tools**: Technologies used (array)
- **Role**: Your role in the project
- **Demo**: Live demo URL
- **Code**: Repository URL
- **Featured**: Toggle to feature on homepage
- **Order**: Display order (lower numbers appear first)

### Skills
- **Name**: Skill name (e.g., "React", "TypeScript")
- **Category**: Frontend, Backend, Database, DevOps, Design, Other
- **Order**: Display order

### Experience
- **Title**: Job title
- **Company**: Company name
- **Duration**: Display duration (e.g., "Jan 2024 - Present")
- **Start Date**: Actual start date
- **End Date**: End date (leave empty if current)
- **Description**: Job description
- **Order**: Display order

### Personal Information
- **Name**: Your full name
- **Designation**: Your title/role
- **Description**: About me text
- **Profile Image**: Your profile photo
- **Contact Info**: Email, phone, address
- **Social Links**: GitHub, LinkedIn, Twitter, etc.
- **Resume**: Resume URL

## Fallback to Local Data

If Sanity is not configured or fails to fetch data, the site will automatically fall back to the local data files in `src/utils/data/`. This ensures your site always works, even without CMS setup.

## Benefits of Using Sanity

✅ **No Code Changes**: Update content without touching code  
✅ **Rich Media**: Upload and manage images directly  
✅ **Real-time Updates**: Changes reflect immediately  
✅ **Version History**: Track changes over time  
✅ **Collaboration**: Multiple editors can work together  
✅ **Free Tier**: Generous free tier for personal projects  

## Troubleshooting

### Content Not Showing?

1. Check your `.env.local` file has correct credentials
2. Verify your Sanity project has content published
3. Check browser console for errors
4. Ensure your Sanity project has the correct schema deployed

### Images Not Loading?

- Make sure images are uploaded to Sanity (not external URLs)
- Check image asset permissions in Sanity settings
- Verify CORS settings allow your domain

## Need Help?

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community](https://slack.sanity.io/)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/js-client)
