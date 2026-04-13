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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // --- নতুন ফাংশন: এটি সার্চ বার থেকে ডাটা নিয়ে স্টেট আপডেট করবে ---
  const handleSearch = (filters: any) => {
    // চেক করা হচ্ছে সব ফিল্ড খালি কি না
    const hasData = Object.values(filters).some(val => val !== "");
    
    if (hasData) {
      setSearchFilters(filters); // ডাটা থাকলে ফিল্টার সেট হবে
    } else {
      setSearchFilters(null); // ডাটা না থাকলে নাল হবে (রিসেন্ট ডাটা দেখাবে)
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)]">
      
      {/* ১. এখানে onSearch প্রপসটি পাস করতে হবে */}
      <Hero onSearch={handleSearch} />

      <div className="container mx-auto py-4">
        {/* ২. এখানে স্টেটটি লিস্টে যাচ্ছে */}
        <MasjidList searchFilters={searchFilters} />
      </div>

      <Footer language={lang} key={lang} />
    </main>
  );
}