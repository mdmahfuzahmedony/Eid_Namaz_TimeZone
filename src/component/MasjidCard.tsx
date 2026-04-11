"use client";

import { MapPin, User, Navigation } from "lucide-react";

interface MasjidCardProps {
  name: string;
  type: string; // মসজিদ বা ঈদগাহ
  imamName?: string;
  mapLink?: string;
  imageUrl?: string;
  jamaat1?: string;
  jamaat2?: string;
  gram?: string;
  unionName?: string;
  upazilaName?: string;
}

export default function MasjidCard({
  name,
  type,
  imamName,
  mapLink,
  imageUrl,
  jamaat1,
  jamaat2,
  gram,
  unionName,
  upazilaName,
}: MasjidCardProps) {
  return (
    <div className="
      /* ১. এন্ট্রান্স অ্যানিমেশন (Left to Right) */
      animate-in fade-in slide-in-from-left-6 duration-700
      
      /* ২. কার্ড ডিজাইন ও সাইজ (Compact) */
      group bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden 
      flex flex-col shadow-lg transition-all 
      
      /* ৩. কার্ড হোভার অ্যানিমেশন (Simple) */
      hover:border-yellow-500/30 hover:bg-slate-900/80 hover:shadow-yellow-500/5 
      hover:-translate-y-1
    ">
      
      {/* ইমেজ সেকশন (সাইজ কমানো হয়েছে এবং এনিমেশন সরানো হয়েছে) */}
      <div className="relative h-36 overflow-hidden">
        <img 
          src={imageUrl || "/no-image.jpg"} 
          className="w-full h-full object-cover" // জুম অ্যানিমেশন সরানো হয়েছে
          alt={name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
      </div>

      {/* কার্ড বডি (প্যাডিং কমানো হয়েছে) */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        
        {/* নাম ও ঠিকানা */}
        <div>
          <h3 className="font-bold text-base leading-tight truncate text-slate-100 group-hover:text-yellow-400 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center gap-1 text-slate-400 mt-1">
            <MapPin size={10} className="text-yellow-500 shrink-0" />
            <p className="text-[10px] truncate">
              {gram && `${gram}, `}{unionName}, {upazilaName}
            </p>
          </div>
        </div>

        {/* ইমাম এবং ধরন (একই লাইনে) */}
        <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2.5">
          <div className="flex items-center gap-1.5 text-yellow-500 max-w-[70%]">
            <User size={12} className="text-slate-500 shrink-0" />
            <p className="text-[10px] truncate italic">
              {imamName ? `ইমাম: ${imamName}` : "ইমামের তথ্য নেই"}
            </p>
          </div>
          
          <span className="bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-yellow-500 shrink-0 uppercase">
            {type}
          </span>
        </div>

        {/* জামাত টাইমস (কমপ্যাক্ট ডিজাইন) */}
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <div className="bg-slate-800/40 p-2 rounded-xl border border-white/5 text-center shadow-inner">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-0.5">১ম জামাত</p>
            <p className="font-black text-yellow-500 text-xs">{jamaat1 || '--:--'}</p>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-xl border border-white/5 text-center shadow-inner">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-0.5">২য় জামাত</p>
            <p className="font-black text-slate-300 text-xs">{jamaat2 || '--:--'}</p>
          </div>
        </div>

        {/* গুগল ম্যাপ বাটন (সম্পূর্ণ বাংলায় এবং ছোট সাইজ) */}
        {mapLink && (
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1.5 w-full py-2.5 bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95"
          >
            <Navigation size={12} />
            ম্যাপে দেখুন
          </a>
        )}
      </div>
    </div>
  );
}