"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion as baseMotion } from "framer-motion";
import { useEffect } from "react";
import styles from "./navbar.module.css";
import { FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope, FaBookOpen } from "react-icons/fa";

type LocalMotionProps = {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    transition?: Record<string, unknown>;
};

type MotionNavProps = React.ComponentProps<typeof baseMotion.nav> & LocalMotionProps;

const motion = {
    ...baseMotion,
    nav: baseMotion.nav as React.ComponentType<MotionNavProps>,
};

type NavbarLabels = {
    home?: string;
    about?: string;
    skills?: string;
    projects?: string;
    writing?: string;
    contact?: string;
};

type NavbarProps = {
    labels?: NavbarLabels;
};

const buildNavItems = (labels?: NavbarLabels) => [
    { name: labels?.home || "Home", href: "/", icon: FaHome, hash: null },
    { name: labels?.about || "About", href: "/#about", icon: FaUser, hash: "about" },
    { name: labels?.skills || "Skills", href: "/#skills", icon: FaCode, hash: "skills" },
    { name: labels?.projects || "Projects", href: "/#projects", icon: FaBriefcase, hash: "projects" },
    { name: labels?.writing || "Writing", href: "/#writing", icon: FaBookOpen, hash: "writing" },
    { name: labels?.contact || "Contact", href: "/#contact", icon: FaEnvelope, hash: "contact" },
];

function Navbar({ labels }: NavbarProps) {
    const navItems = buildNavItems(labels);
    const pathname = usePathname();

    // Handle smooth scrolling for hash links
    const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string | null) => {
        if (hash) {
            e.preventDefault();
            const element = document.getElementById(hash);
            if (element) {
                const navbarHeight = 80; // Approximate navbar height + offset
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight;

                // Update URL hash
                window.history.pushState(null, "", `#${hash}`);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    // Handle hash navigation on page load/mount
    useEffect(() => {
        const handleHashNavigation = () => {
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                const element = document.getElementById(hash);
                if (element) {
                    setTimeout(() => {
                        const navbarHeight = 80;
                        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navbarHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }, 100);
                }
            }
        };

        handleHashNavigation();
        window.addEventListener("hashchange", handleHashNavigation);
        return () => window.removeEventListener("hashchange", handleHashNavigation);
    }, [pathname]);

    return (
        <div className={styles.navContainer}>
            <motion.nav
                className={styles.navbar}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ul className={styles.navList}>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link 
                                href={item.href} 
                                className={styles.navItem}
                                onClick={(e) => handleHashClick(e, item.hash)}
                            >
                                <item.icon className={styles.icon} />
                                <span className={styles.label}>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </motion.nav>
        </div>
    );
};

export default Navbar;
