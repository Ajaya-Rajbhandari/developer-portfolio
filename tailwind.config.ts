import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/utils/data/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "bg-dark": "var(--bg-dark)",
                "bg-card": "var(--bg-card)",
                "bg-card-hover": "var(--bg-card-hover)",
                "primary-accent": "var(--primary-accent)",
                "secondary-accent": "var(--secondary-accent)",
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "border-light": "var(--border-light)",
                "border-hover": "var(--border-hover)",
                "surface-muted": "var(--surface-muted)",
                "surface-soft": "var(--surface-soft)",
                "surface-raised": "var(--surface-raised)",
                "button-gradient-to": "var(--button-gradient-to)",
                "card-shine": "var(--card-shine)",
                "image-overlay-from": "var(--image-overlay-from)",
                "image-overlay-via": "var(--image-overlay-via)",
                "case-badge-bg": "var(--case-badge-bg)",
                "case-badge-text": "var(--case-badge-text)",
                "timeline-ring": "var(--timeline-ring)",
            },
        },
    },
    plugins: [],
};
export default config;
