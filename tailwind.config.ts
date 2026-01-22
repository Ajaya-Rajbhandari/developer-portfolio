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
            },
        },
    },
    plugins: [],
};
export default config;
