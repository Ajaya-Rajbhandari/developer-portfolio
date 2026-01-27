import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajaya Rajbhandari - Developer Portfolio",
  description: "Portfolio of Ajaya Rajbhandari, a Full-Stack Software Developer.",
  alternates: {
    sitemap: "/sitemap.xml",
  },
};

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <a className="skip-to-content" href="#main-content">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" style={{ position: 'relative' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
