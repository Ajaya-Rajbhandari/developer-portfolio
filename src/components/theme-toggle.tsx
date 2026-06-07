"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./theme-toggle.module.css";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme: ThemeMode = savedTheme === "light" ? "light" : "dark";

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "moon dark" : "sun light"} mode`}
      aria-pressed={isLight}
      title={isLight ? "Switch to moon mode" : "Switch to sun mode"}
      data-mounted={mounted}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.sun} data-active={isLight}><FaSun /></span>
        <span className={styles.moon} data-active={!isLight}><FaMoon /></span>
        <span className={styles.thumb} data-theme={theme}>
          <span className={styles.thumbCore} />
        </span>
      </span>
    </button>
  );
}
