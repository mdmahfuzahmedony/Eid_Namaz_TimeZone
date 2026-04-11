import React from "react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    // bg-transparent করা হয়েছে যাতে মেইন ব্যাকগ্রাউন্ড দেখা যায়
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-[1600px] mx-auto pt-10 px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
}