"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SearchBar from "./searchBar";
import AddMasjid from "./addMasjid";
import Countdown from "./countdown";
import Navbar from "./Navbar";

interface HeroProps {
  compact?: boolean;
  onSearch?: (filters: any) => void;
}

export default function Hero({ compact = false, onSearch }: HeroProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .hero-text-shadow { text-shadow: 0 4px 12px rgba(0,0,0,0.8); }
      `}</style>

      <div className={`relative flex flex-col overflow-hidden transition-all duration-500 ${compact ? "min-h-[90px]" : "min-h-[500px] sm:min-h-[600px]"} bg-transparent`}>
        
        <div className="absolute bottom-0 left-0 right-0 h-40 z-[3] bg-gradient-to-t from-black/40 to-transparent" />

        {/* NAVBAR */}
        <Navbar onAddClick={() => setShowModal(true)} />

        {/* HERO CONTENT */}
        {!compact && (
          <div className="relative z-10 flex flex-col mt-6 items-center text-center px-4 sm:px-6 pb-20 flex-1 justify-center">
            
            <div className="mb-8 flex flex-col items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs text-yellow-500 font-bold tracking-wide uppercase">
                  ⚠️ চাঁদ দেখার ওপর ভিত্তি করে সম্ভাব্য তারিখ
                </p>
              </div>
              <div className="hover:scale-105 transition-transform duration-500">
                <Countdown finalDate="2026-05-27T00:00:00" language="bn" />
              </div>
            </div>

            <div className="animate-float inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-yellow-400 text-[11px] font-black px-4 py-2 rounded-full mb-6 tracking-widest uppercase shadow-xl">
              🌙 ঈদুল আযহা ২০২৬
            </div>

            <h1 className="text-white font-black leading-[1.2] mb-6 hero-text-shadow text-[1.8rem] sm:text-[2.8rem] md:text-[3.2rem]">
              আপনার এলাকার <br /> <span className="text-yellow-400 italic"> ঈদের নামাজের সময়</span> খুঁজুন
            </h1>

            <p className="text-slate-100 text-xs sm:text-sm mb-10 max-w-md leading-relaxed hero-text-shadow font-medium">
              জেলা থেকে গ্রাম পর্যন্ত — সারা বাংলাদেশের সব এলাকার ঈদের নামাজের সময় এখন এখানে।
            </p>

            {/* SEARCH BAR CONNECTION */}
            <div className="w-full flex justify-center transform hover:scale-[1.01] transition-transform duration-300">
              <SearchBar onSearch={onSearch} language="bn" />
            </div>

            <div className="flex gap-10 sm:gap-20 mt-12">
              {[
                { num: "৩৫০০০০+", label: "মসজিদ ও ঈদগাহ" },
                { num: "৬৪",    label: "জেলা" },
                { num: "৯০,০৪৯+", label: "গ্রাম" },
              ].map((s, idx) => (
                <div key={idx} className="text-center group cursor-default">
                  <div className="text-yellow-400 text-xl sm:text-3xl font-black transition-transform group-hover:scale-110">
                    {s.num}
                  </div>
                  <div className="text-slate-200 text-[10px] sm:text-[11px] font-bold mt-1 uppercase tracking-widest hero-text-shadow">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[3rem] bg-slate-900 shadow-2xl border border-white/5 p-2">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white transition-all">
              <X size={20} />
            </button>
            <AddMasjid language="bn" />
          </div>
        </div>
      )}
    </>
  );
}