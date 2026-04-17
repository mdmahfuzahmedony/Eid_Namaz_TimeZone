"use client";

import Image from "next/image";

export default function Footer({ language = "bn" }) {
  const content = {
    description: language === "bn" 
      ? "সারা বাংলাদেশের ঈদের নামাজের সময়সূচি এবং ঈদগাহের তথ্য সবার আগে পেতে আমাদের সাথে থাকুন।" 
      : "Stay with us to get Eid prayer schedules and Eidgah information across Bangladesh first.",
    copyright: language === "bn" 
      ? "© ২০২৬ — সকল স্বত্ব সংরক্ষিত" 
      : "© 2026 — All Rights Reserved",
    credit: language === "bn" ? "কারিগরি সহযোগিতায়" : "Developed by",
  };

  return (
    <footer className="w-full mt-24 border-t border-white/5 backdrop-blur-xl py-14 px-6 relative overflow-hidden">
      
      {/* টপ বর্ডার লাইট ইফেক্ট */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div> */}

      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
        
        {/* ১. লোগো সেকশন */}
      {/* ══════════════ লোগো সেকশন (EIDGA BD) ══════════════ */}
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => router.push("/")}>
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-110" />
            </div>
            <div className="text-white font-black text-lg sm:text-xl leading-tight hero-text-shadow font-serif tracking-tighter">
              <p>EIDGHA <span className="text-yellow-500">BD</span></p> 
            </div>
          </div>

        {/* ২. বর্ণনা */}
        <p className="max-w-md text-slate-400 text-[13px] leading-relaxed font-medium mb-8">
          {content.description}
        </p>

     

        {/* ৪. ডিভাইডার লাইন */}
        <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* ৫. কপিরাইট এবং ক্রেডিট */}
        <div className="flex flex-col gap-2">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] opacity-80">
            {content.copyright}
          </p>
          <p className="text-slate-400 text-[12px] font-bold mt-1">
            {content.credit} {" "}
            <a 
              href="#" 
              className="text-yellow-500 hover:text-white transition-all duration-300 underline underline-offset-4 decoration-yellow-500/30"
            >
              Mahfuz Ahmed
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}