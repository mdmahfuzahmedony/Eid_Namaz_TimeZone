"use client";

import { useState, useEffect } from "react";
import Hero from "@/component/hero";
import Footer from "@/component/footer";
import MasjidList from "@/component/MasjidList";

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<null | any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("bn");

  useEffect(() => {
    // ✅ Page load এ saved theme apply করা
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      // light mode নিশ্চিত করা
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)]">
      <Hero
        darkMode={darkMode}
        toggleDark={toggleTheme}
        onSearch={(filters) => setSearchFilters(filters)}
      />

      <div className="container mx-auto py-4">
        <MasjidList searchFilters={searchFilters} />
      </div>

      <Footer language={lang} key={lang} />
    </main>
  );
}
