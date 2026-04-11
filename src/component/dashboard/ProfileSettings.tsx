"use client";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, Camera, Loader2 } from "lucide-react";

export default function ProfileSettings({ profileData, setProfileData, onUpdate, loading, selectedFile, setSelectedFile }: any) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 max-w-xl mx-auto">
      <h2 className="text-2xl font-black mb-10 text-yellow-500 text-center uppercase tracking-widest">প্রোফাইল সেটিংস</h2>
      <form onSubmit={onUpdate} className="space-y-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-36 h-36">
            <img src={selectedFile ? URL.createObjectURL(selectedFile) : profileData.image || "/profile.png"} className="w-full h-full object-cover rounded-[2.5rem] border-4 border-slate-700 shadow-2xl" alt="" />
            <label className="absolute bottom-0 right-0 p-3 bg-yellow-500 rounded-2xl cursor-pointer shadow-xl hover:scale-110 transition-transform">
              <Camera size={20} className="text-black" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
        <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl">
          <input type="text" className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:border-yellow-500 transition-all text-white" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} placeholder="আপনার নাম" required />
          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder="বর্তমান পাসওয়ার্ড" className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 text-white" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div>
          <input type={showPass ? "text" : "password"} placeholder="নতুন পাসওয়ার্ড" className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 text-white" value={profileData.newPassword} onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black shadow-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : "সব তথ্য সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}