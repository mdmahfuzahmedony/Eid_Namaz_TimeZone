"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun, Plus, X } from "lucide-react";
import SearchBar from "./searchBar";
import AddMasjid from "./addMasjid";
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
        {/* Background Image with Ken Burns */}
        <div 
          className="absolute inset-0 z-0 animate-kenburns bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }} 
        />

        {/* Fixed Dark Overlay */}
        <div className="absolute inset-0 z-[1] bg-black/50" />

        {/* Bottom Fade */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-36 z-[3] transition-colors duration-700 ${
            darkMode
              ? "bg-gradient-to-t from-[#020617] to-transparent"
              : "bg-gradient-to-t from-white to-transparent"
          }`}
        />

        {/* TOP BAR */}
        <div className="relative z-10 w-full">
          <div className="max-w-[1400px]  mx-auto  flex items-center justify-between px-4  py-3.5">
            <div
              className="flex items-center gap-3  cursor-pointer group"
              onClick={() => router.push("/")}
            >
              {/* FIXED LOGO CONTAINER: সাইজ বাড়ানো হয়েছে */}
              <div className="relative  w-14 h-14 sm:w-20 sm:h-20 flex items-start justify-items-start overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full left-0 h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-300"
                />
              </div>

              <div className="hero-text-shadow  hidden xs:block">
                <div className="text-white font-bold text-sm sm:text-base leading-tight tracking-wide">
                  ঈদের নামাজ
                </div>
                <div className="text-white/60 text-[10px] sm:text-xs">সারা বাংলাদেশ</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleDark}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                <Plus size={14} />
                <span>মসজিদ যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* HERO CONTENT */}
        {!compact && (
          <div className="relative z-10 flex flex-col  mt-6 items-center text-center px-4 sm:px-6 pb-16 flex-1 justify-center">
            
            <div className="animate-float inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-[10px] sm:text-[11px] font-medium px-3.5 py-1.5 rounded-full mb-5 tracking-wider">
              🌙 ঈদুল ফিতর ২০২৬
            </div>

            <h1
              className="text-white font-bold leading-[1.3] mb-4 hero-text-shadow text-[1.75rem] sm:text-[2.2rem] md:text-[2.6rem]"
              style={{ fontFamily: "var(--font-noto)" }}
            >
              আপনার গ্রামের ঈদের
              <br />
              <span className="text-yellow-400">নামাজের সময়</span> খুঁজুন
            </h1>

            <p className="text-white/80 text-[12px] sm:text-[14px] mb-8 max-w-sm leading-relaxed hero-text-shadow">
              জেলা থেকে গ্রাম পর্যন্ত — সব ঈদগাহ ও মসজিদের সময়সূচি এবং জামাতের
              তথ্য এখন এক ক্লিকেই।
            </p>

            <div className="w-full flex justify-center transform hover:scale-[1.01] transition-transform duration-300">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* Statistics */}
            <div className="flex gap-8 sm:gap-14 mt-10">
              {[
                { num: "১,২৪৩", label: "মসজিদ ও ঈদগাহ" },
                { num: "৬৪",    label: "জেলা" },
                { num: "৩,৮০০+", label: "গ্রাম" },
              ].map((s, idx) => (
                <div key={idx} className="text-center group cursor-default hero-text-shadow">
                  <div className="text-yellow-400 text-lg sm:text-2xl font-bold transition-transform group-hover:scale-110">
                    {s.num}
                  </div>
                  <div className="text-white/60 text-[9px] sm:text-[10px] font-medium mt-1 tracking-wide uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
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