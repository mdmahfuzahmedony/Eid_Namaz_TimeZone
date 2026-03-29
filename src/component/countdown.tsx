"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownProps {
  finalDate: string;
  language: "bn" | "en";
}

export default function Countdown({ finalDate, language }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(finalDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [finalDate]);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!mounted) return <div className="h-16 sm:h-20" />;

  const toBn = (n: number) => {
    const enToBn: any = { "0":"০","1":"১","2":"২","3":"৩","4":"৪","5":"৫","6":"৬","7":"৭","8":"৮","9":"৯" };
    return String(n).padStart(2, "0").split("").map(d => enToBn[d] || d).join("");
  };

  const labels = language === "bn" 
    ? ["দিন", "ঘণ্টা", "মিনিট", "সেকেন্ড"] 
    : ["Days", "Hrs", "Mins", "Secs"];

  const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <div className="inline-flex items-center justify-center p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent shadow-xl">
      <div className="flex items-center gap-2 sm:gap-4 px-4 py-2.5 sm:px-6 sm:py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5">
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3">
            {/* সংখ্যা এবং লেবেল একসাথে */}
            <div className="flex flex-col items-center">
              <span 
                key={val}
                className="text-lg sm:text-2xl font-bold text-yellow-400 tabular-nums drop-shadow-[0_0_8px_rgba(250,204,21,0.3)] animate-in fade-in zoom-in duration-300"
              >
                {language === "bn" ? toBn(val) : String(val).padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                {labels[i]}
              </span>
            </div>

            {/* কোলন ডিভাইডার */}
            {i !== values.length - 1 && (
              <span className="text-white/20 font-light text-sm sm:text-lg mb-3">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}