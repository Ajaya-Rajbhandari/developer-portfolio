import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajaya Rajbhandari - Full-Stack Software Developer",
  description:
    "Full-stack developer portfolio for Ajaya Rajbhandari, focused on responsive web applications, JavaScript, TypeScript, React, Next.js, and practical product development.",
};

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { fetchPersonalData } from "@/lib/data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personalData = await fetchPersonalData();

  return (
    <html lang="en">
      <body className={outfit.className}>
        <a className="skip-to-content" href="#main-content">
          Skip to main content
        </a>
        <Navbar labels={personalData.navLabels} />
        <main id="main-content" style={{ position: 'relative' }}>{children}</main>
        <Footer text={personalData.footerText} ownerName={personalData.footerOwnerName} ownerLink={personalData.footerLink} />
      </body>
    </html>
  );
}
