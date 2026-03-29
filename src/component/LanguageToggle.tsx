"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageToggleProps {
  currentLang: "bn" | "en";
  onChange: (lang: "bn" | "en") => void;
}

export default function LanguageToggle({ currentLang, onChange }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার জন্য
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* মেইন বাটন */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg"
      >
        <Globe size={16} className="text-yellow-400" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {currentLang === "bn" ? "বাংলা" : "English"}
        </span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* ড্রপডাউন মেনু */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 py-1.5 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => {
              onChange("bn");
              setIsOpen(false);
            }}
            className={`w-full flex items-center px-4 py-2 text-[11px] font-bold transition-colors ${
              currentLang === "bn" ? "text-yellow-400 bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            বাংলা (BN)
          </button>
          
          <div className="h-[1px] bg-white/5 mx-2" /> {/* ডিভাইডার */}
          
          <button
            onClick={() => {
              onChange("en");
              setIsOpen(false);
            }}
            className={`w-full flex items-center px-4 py-2 text-[11px] font-bold transition-colors ${
              currentLang === "en" ? "text-yellow-400 bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            ENGLISH (EN)
          </button>
        </div>
      )}
    </div>
  );
}