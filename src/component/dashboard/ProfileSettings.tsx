"use client";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, Camera, Loader2 } from "lucide-react";

export default function ProfileSettings({ 
  profileData, 
  setProfileData, 
  onUpdate, 
  loading, 
  selectedFile, 
  setSelectedFile 
}: any) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 max-w-md mx-auto">
      {/* শিরোনাম - ছোট করা হয়েছে */}
      <h2 className="text-lg font-bold mb-8 text-yellow-500 text-center uppercase tracking-widest italic">
        প্রোফাইল সেটিংস
      </h2>

      <form onSubmit={onUpdate} className="space-y-5">
        {/* প্রোফাইল ইমেজ - সাইজ একটু কমানো হয়েছে */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28">
            <img 
              src={selectedFile ? URL.createObjectURL(selectedFile) : profileData.image || "/profile.png"} 
              className="w-full h-full object-cover rounded-[2rem] border-2 border-slate-700 shadow-xl" 
              alt="Profile" 
            />
            <label className="absolute -bottom-1 -right-1 p-2 bg-yellow-500 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform border-2 border-slate-900">
              <Camera size={16} className="text-black" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
              />
            </label>
          </div>
          <p className="mt-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">ছবি পরিবর্তন করুন</p>
        </div>

        {/* মেইন কার্ড - প্যাডিং কমানো হয়েছে */}
        <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
          
          {/* নাম ইনপুট */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">আপনার নাম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                className="w-full bg-slate-800/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-yellow-500/50 transition-all text-white placeholder:text-slate-600" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                placeholder="এখানে লিখুন..." 
                required 
              />
            </div>
          </div>

          {/* বর্তমান পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">বর্তমান পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="এখানে দিন..." 
                className="w-full bg-slate-800/40 border border-white/5 rounded-xl pl-10 pr-10 py-3 text-sm font-medium outline-none focus:border-yellow-500/50 text-white placeholder:text-slate-600" 
                value={profileData.password} 
                onChange={(e) => setProfileData({...profileData, password: e.target.value})} 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-yellow-500 transition-colors"
              >
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {/* নতুন পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">নতুন পাসওয়ার্ড </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="এখানে লিখুন..." 
                className="w-full bg-slate-800/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-yellow-500/50 text-white placeholder:text-slate-600" 
                value={profileData.newPassword} 
                onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})} 
              />
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-yellow-500 text-black py-3.5 rounded-xl text-sm font-bold shadow-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "সেভ করুন"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}