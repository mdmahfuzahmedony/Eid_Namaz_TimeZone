"use client";
import { ArrowLeft, Timer } from "lucide-react";
import Countdown from "./../countdown";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ session, eidDate }: any) {
  const router = useRouter();
  return (
    <header className="relative w-full rounded-[3rem] border border-white/10 mb-10 shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-10 flex flex-col items-center gap-6">
      <div className="w-full flex items-center justify-between">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 transition-all"
        >
          <ArrowLeft size={16} className="text-yellow-500" />
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl p-1.5 pr-5 rounded-2xl border border-white/10">
          <img
            src={session?.user?.image || "/profile.png"}
            className="w-10 h-10 object-cover rounded-xl border-2 border-yellow-500 shadow-lg"
            alt="profile"
          />
          <div className="text-left hidden lg:block">
            <h2 className="font-bold text-xs">{session?.user?.name}</h2>
            <p className="text-[8px] text-yellow-500 font-black uppercase tracking-widest">
              Active Member
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 mb-6 bg-yellow-500/10 backdrop-blur-2xl px-5 py-2 rounded-full border border-yellow-500/20 shadow-lg">
          <Timer size={16} className="text-yellow-500 animate-pulse" />
          <p className="text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-widest">
            ঈদুল আযহা আসতে আর মাত্র বাকি ...
          </p>
        </div>
        <div className="w-full max-w-xl scale-90 sm:scale-125">
          <Countdown finalDate={eidDate} language="bn" />
        </div>
      </div>
    </header>
  );
}
