import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajaya Rajbhandari - Full-Stack Software Developer",
  description:
    "Full-stack developer portfolio for Ajaya Rajbhandari, focused on responsive web applications, JavaScript, TypeScript, React, Next.js, and practical product development.",
};

import SiteChrome from "@/components/layout/site-chrome";
import { fetchPersonalData } from "@/lib/data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personalData = await fetchPersonalData();

  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className={outfit.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('portfolio-theme');var m=t==='light'?'light':'dark';document.documentElement.dataset.theme=m;document.documentElement.style.colorScheme=m;}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark';}`}
        </Script>
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`try{if('scrollRestoration' in history){history.scrollRestoration='manual';}}catch(e){}`}
        </Script>
        <SiteChrome
          navLabels={personalData.navLabels}
          footerText={personalData.footerText}
          footerOwnerName={personalData.footerOwnerName}
          footerLink={personalData.footerLink}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
