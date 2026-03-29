"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun, Plus, X } from "lucide-react";
import SearchBar from "./searchBar";
import AddMasjid from "./addMasjid";
import Countdown from "./countdown";
import LanguageToggle from "./LanguageToggle";
import { useState } from "react";

interface HeroProps {
  darkMode: boolean;
  toggleDark: () => void;
  compact?: boolean;
  onSearch?: (filters: {
    divisionId?: string;
    districtId?: string;
    upazilaId?: string;
    unionId?: string;
    gram?: string;
  }) => void;
}

export default function Hero({
  darkMode,
  toggleDark,
  compact = false,
  onSearch,
}: HeroProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [lang, setLang] = useState<"bn" | "en">("bn"); // ভাষা স্টেট যোগ করা হয়েছে

  return (
    <>
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-kenburns {
          animation: kenBurns 40s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .hero-text-shadow {
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
      `}</style>

      <div
        className={`relative flex flex-col overflow-hidden transition-all duration-500 
          ${compact ? "min-h-[90px]" : "min-h-[500px] sm:min-h-[560px]"} 
          bg-black`}
      >
        <div
          className="absolute inset-0 z-0 animate-kenburns bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />

        <div className="absolute inset-0 z-[1] bg-black/50" />

        <div
          className={`absolute bottom-0 left-0 right-0 h-36 z-[3] transition-colors duration-700 ${
            darkMode
              ? "bg-gradient-to-t from-[#020617] to-transparent"
              : "bg-gradient-to-t from-white to-transparent"
          }`}
        />

        {/* TOP BAR */}
        {/* TOP BAR */}
{/* TOP BAR */}
<div className="relative z-20 w-full">
  <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
    
    {/* বাম পাশে লোগো */}
    <div
      className="flex items-center gap-2 cursor-pointer group shrink-0"
      onClick={() => router.push("/")}
    >
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-300"
        />
      </div>
      <div className="hero-text-shadow hidden xs:block">
        <div className="text-white font-bold text-xs sm:text-sm leading-tight">
          {lang === "bn" ? "ঈদের নামাজ" : "Eid Prayer"}
        </div>
      </div>
    </div>

    {/* ডান পাশে বাটন গ্রুপ (একদম ডানে থাকবে) */}
    <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
      
      {/* ১. ল্যাঙ্গুয়েজ ড্রপডাউন */}
      <LanguageToggle currentLang={lang} onChange={setLang} />

      {/* ২. ডার্ক মোড */}
      <button
        onClick={toggleDark}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* ৩. প্লাস বাটন (মোবাইলে শুধু আইকন থাকবে যাতে স্পেস বাঁচে) */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl transition-all shadow-lg active:scale-95 w-9 h-9 sm:w-auto sm:px-4 sm:py-2.5"
      >
        <Plus size={16} />
        <span className="hidden sm:inline text-[11px] font-bold ml-1.5 uppercase tracking-wider">
           {lang === "bn" ? "মসজিদ যোগ" : "Add"}
        </span>
      </button>
    </div>

  </div>
</div>

        {/* HERO CONTENT */}
        {!compact && (
          <div className="relative z-10 flex flex-col mt-6 items-center text-center px-4 sm:px-6 pb-16 flex-1 justify-center">
            
            {/* কাউন্টডাউন এবং সম্ভাব্য তারিখের নোট */}
            <div className="mb-8 flex flex-col items-center gap-3">
              <div className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
                <p className="text-[10px] sm:text-xs text-yellow-500/80 font-medium tracking-wide">
                  {lang === "bn" 
                    ? "⚠️ চাঁদ দেখার ওপর ভিত্তি করে তারিখ পরিবর্তন হতে পারে (সম্ভাব্য তারিখ)" 
                    : "⚠️ Date may change based on moon sighting (Tentative Date)"}
                </p>
              </div>

              <div className="hover:scale-105 transition-transform duration-500">
                <Countdown finalDate="2026-05-27T00:00:00" language={lang} />
              </div>
            </div>

            <div className="animate-float inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-[10px] sm:text-[11px] font-medium px-3.5 py-1.5 rounded-full mb-5 tracking-wider">
              🌙 {lang === "bn" ? "ঈদুল আযহা ২০২৬" : "Eid-ul-Adha 2026"}
            </div>

            <h1
              className="text-white font-bold leading-[1.3] mb-4 hero-text-shadow text-[1.75rem] sm:text-[2.2rem] md:text-[2.6rem]"
              style={{ fontFamily: "var(--font-noto)" }}
            >
              {lang === "bn" ? (
                <>আপনার গ্রামের ঈদের <br /> <span className="text-yellow-400">নামাজের সময়</span> খুঁজুন</>
              ) : (
                <>Find Your Village's <br /> <span className="text-yellow-400">Eid Prayer Time</span></>
              )}
            </h1>

            <p className="text-white/80 text-[12px] sm:text-[14px] mb-8 max-w-sm leading-relaxed hero-text-shadow">
              {lang === "bn" 
                ? "জেলা থেকে গ্রাম পর্যন্ত — সব ঈদগাহ ও মসজিদের সময়সূচি এবং জামাতের তথ্য এখন এক ক্লিকেই।"
                : "From districts to villages — all Eidgah and Mosque schedules and Jamat info in one click."}
            </p>

            <div className="w-full flex justify-center transform hover:scale-[1.01] transition-transform duration-300">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* Statistics */}
            <div className="flex gap-8 sm:gap-14 mt-10">
              {[
                { num: "১,২৪৩", numEn: "1,243", bn: "মসজিদ ও ঈদগাহ", en: "Masjids" },
                { num: "৬৪", numEn: "64", bn: "জেলা", en: "Districts" },
                { num: "৩,৮০০+", numEn: "3,800+", bn: "গ্রাম", en: "Villages" },
              ].map((s, idx) => (
                <div key={idx} className="text-center group cursor-default hero-text-shadow">
                  <div className="text-yellow-400 text-lg sm:text-2xl font-bold transition-transform group-hover:scale-110">
                    {lang === "bn" ? s.num : s.numEn}
                  </div>
                  <div className="text-white/60 text-[9px] sm:text-[10px] font-medium mt-1 tracking-wide uppercase">
                    {lang === "bn" ? s.bn : s.en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL (Add Masjid) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border dark:border-gray-800">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors text-gray-700 dark:text-gray-200"
            >
              <X size={16} />
            </button>
            <div className="p-2">
              <AddMasjid />
            </div>
          </div>
        </div>
      )}
    </>
  );
}