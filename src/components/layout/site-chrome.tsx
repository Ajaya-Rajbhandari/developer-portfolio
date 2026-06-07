"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

type NavbarLabels = {
    home?: string;
    about?: string;
    skills?: string;
    projects?: string;
    writing?: string;
    contact?: string;
};

type SiteChromeProps = {
    navLabels?: NavbarLabels;
    footerText?: string;
    footerOwnerName?: string;
    footerLink?: string;
    children: React.ReactNode;
};

export default function SiteChrome({
    navLabels,
    footerText,
    footerOwnerName,
    footerLink,
    children,
}: SiteChromeProps) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");

    // Sanity Studio is a full-screen app with its own chrome — render it bare,
    // without the portfolio navbar/footer.
    if (isStudio) {
        return <>{children}</>;
    }

    return (
        <>
            <a className="skip-to-content" href="#main-content">
                Skip to main content
            </a>
            <Navbar labels={navLabels} />
            <main id="main-content" style={{ position: "relative" }}>
                {children}
            </main>
            <Footer text={footerText} ownerName={footerOwnerName} ownerLink={footerLink} />
        </>
    );
}
