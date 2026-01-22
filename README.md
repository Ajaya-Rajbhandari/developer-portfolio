# Ajaya Rajbhandari - Developer Portfolio

This is a personal portfolio website built with **Next.js 14**, **TypeScript**, and **Vanilla CSS**.

## Features

- **Modern & Premium Design**: Custom dark-mode aesthetic with neon accents.
- **Responsive Layout**: Fully optimized for desktop and mobile.
- **Dynamic Content**: Data-driven components for easy updates.
- **CMS Integration**: Optional Sanity CMS support for content management.
- **SEO Optimized**: Built with Next.js App Router.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules (Vanilla CSS)
- **CMS**: Sanity.io (Optional)
- **Deployment**: Vercel (Recommended)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Ajaya-Rajbhandari/portfolio.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Open in browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Customization

### Option 1: Using Sanity CMS (Recommended)

This portfolio supports Sanity CMS for easy content management. See [CMS_SETUP.md](./CMS_SETUP.md) for detailed setup instructions.

**Benefits:**
- Update content without code changes
- Rich media management
- Real-time updates
- Free tier available

### Option 2: Edit Local Data Files

Edit the data files in `src/utils/data/` to update your information:
- `personal-data.ts`
- `experience.ts`
- `skills.ts`
- `projects-data.ts`

**Note:** If Sanity CMS is configured, it will take priority over local data files.

## License

MIT
