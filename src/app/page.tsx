"use client";

import { useState, useEffect } from "react";
import Hero from "@/component/hero";
import MasjidList from "@/component/MasjidList";
import Footer from './../component/footer';

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<null | any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
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
    <main className="min-h-screen transition-colors duration-500 bg-background text-foreground">
      <Hero
        darkMode={darkMode}
        toggleDark={toggleTheme}
        onSearch={(filters) => setSearchFilters(filters)}
      />

      <div className="container mx-auto py-4">
        <MasjidList searchFilters={searchFilters} />
      </div>

      <Footer />
    </main>
  );
}
