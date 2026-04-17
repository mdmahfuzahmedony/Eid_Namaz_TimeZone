"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, User as UserIcon, LogOut, UserCircle, Image as ImageIcon, Upload, Clock, AlertCircle, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ConfirmModal from "@/component/ConfirmModal"; 

interface NavbarProps {
  onAddClick: () => void;
}

interface CustomImage {
  url: string;
  timestamp: number;
}

export default function Navbar({ onAddClick }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); 
  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<CustomImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultImages = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg", "/bg5.jpg"];
  const EXPIRY_TIME = 86400000; 

  const handleAddClick = () => {
    if (!session) router.push("/login");
    else if (onAddClick) onAddClick();
  };

  const applyBg = (url: string) => {
    const bgLayer = document.getElementById("bg-layer");
    if (bgLayer) {
      bgLayer.style.backgroundImage = `url('${url}')`;
      localStorage.setItem("site-bg", url);
      setCurrentBg(url);
    }
  };

  const checkAndCleanupImages = () => {
    const savedCustom = localStorage.getItem("custom-bg-list");
    if (!savedCustom) return;
    const parsedImages: CustomImage[] = JSON.parse(savedCustom);
    const now = Date.now();
    const validImages = parsedImages.filter((img) => now - img.timestamp < EXPIRY_TIME);

    if (validImages.length !== parsedImages.length) {
      setCustomImages(validImages);
      localStorage.setItem("custom-bg-list", JSON.stringify(validImages));
    }
  };

  useEffect(() => {
    const savedBg = localStorage.getItem("site-bg");
    if (savedBg) applyBg(savedBg);
    const savedCustom = localStorage.getItem("custom-bg-list");
    if (savedCustom) setCustomImages(JSON.parse(savedCustom));

    const interval = setInterval(() => checkAndCleanupImages(), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImage: CustomImage = { url: base64String, timestamp: Date.now() };
        const updatedCustom = [newImage, ...customImages].slice(0, 5);
        setCustomImages(updatedCustom);
        localStorage.setItem("custom-bg-list", JSON.stringify(updatedCustom));
        applyBg(base64String);
        setShowWarningModal(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPhotoAdd = () => {
    setShowWarningModal(false);
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 100);
  };

  return (
    <>
      <nav className="relative z-50 w-full bg-transparent">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          
         {/* ══════════════ লোগো সেকশন (EIDGA BD) ══════════════ */}
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => router.push("/")}>
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-110" />
            </div>
            <div className="text-white font-black text-lg sm:text-xl leading-tight hero-text-shadow font-serif tracking-tighter">
              <p>EIDGHA <span className="text-yellow-500">BD</span></p> 
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* থিম মেনু বাটন */}
            <div className="relative">
              <button 
                onClick={() => {setShowThemeMenu(!showThemeMenu); setShowDropdown(false);}}
                className="w-10 h-10 rounded-xl border-2 border-white/20 overflow-hidden bg-black/40 flex items-center justify-center transition-all active:scale-90"
              >
                {currentBg ? (
                  <img src={currentBg} alt="Theme" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <ImageIcon size={20} className="text-white" />
                )}
              </button>

              {/* ══════════════ ড্রপডাউন মেনু (মোবাইল ও ডেস্কটপ ফিক্সড) ══════════════ */}
              {showThemeMenu && (
                <div 
                  className="
                    /* মোবাইলের জন্য: স্ক্রিনের মাঝখানে ফিক্সড */
                    fixed inset-x-4 top-24 mx-auto w-auto max-w-[340px] 
                    /* ডেস্কটপের জন্য: বাটনের নিচে ডান দিকে */
                    sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-72 
                    
                    bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                    border border-white/10 p-5 z-[100] animate-in fade-in zoom-in-95 duration-200
                  "
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2 text-white">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-yellow-500" />
                      <p className="text-[10px] uppercase font-black tracking-[2px] opacity-70">থিম গ্যালারি</p>
                    </div>
                    <button onClick={() => setShowThemeMenu(false)} className="sm:hidden p-1 hover:bg-white/10 rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2.5 mb-5">
                    {defaultImages.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        onClick={() => { applyBg(img); if(window.innerWidth < 640) setShowThemeMenu(false); }} 
                        className={`w-full h-10 object-cover rounded-xl cursor-pointer border-2 transition-all active:scale-90 ${
                          currentBg === img ? 'border-yellow-500 scale-110 shadow-lg shadow-yellow-500/30' : 'border-white/10'
                        }`} 
                      />
                    ))}
                  </div>

                  {customImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2.5 mb-5 border-t border-white/5 pt-4">
                      {customImages.map((img, index) => (
                        <img 
                          key={index} 
                          src={img.url} 
                          onClick={() => { applyBg(img.url); if(window.innerWidth < 640) setShowThemeMenu(false); }} 
                          className={`w-full h-10 object-cover rounded-xl cursor-pointer border-2 transition-all active:scale-90 ${
                            currentBg === img.url ? 'border-yellow-500 scale-110' : 'border-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={() => {setShowWarningModal(true); setShowThemeMenu(false);}}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl text-[13px] font-black transition-all shadow-xl active:scale-95"
                  >
                    <Plus size={16} strokeWidth={3} /> নতুন ফটো যোগ করুন
                  </button>
                </div>
              )} 
            </div>

            {session ? (
              <div className="relative">
                <button onClick={() => {setShowDropdown(!showDropdown); setShowThemeMenu(false);}} className="w-10 h-10 rounded-xl border-2 border-yellow-500 overflow-hidden bg-slate-800">
                  <img src={session.user?.image || "/profile.png"} className="w-full h-full object-cover" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link href="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
                      <UserCircle size={18} className="text-yellow-500" /> প্রোফাইল
                    </Link>
                    <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 border-t border-white/5 text-left font-bold hover:bg-red-500/5 transition-colors">
                      <LogOut size={18} /> লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleAddClick} className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 flex items-center gap-1">
                <Plus size={16} /> মসজিদ যোগ
              </button>
            )}
          </div>
        </div>
      </nav>

      <ConfirmModal 
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={handleConfirmPhotoAdd} 
        title="একটি ঘোষণা"
        description="আপনার আপলোড করা ছবি আপনার ব্রাউজারে সংরক্ষিত থাকবে এবং ২৪ ঘণ্টা পর এটি অটোমেটিক ডিলিট হয়ে যাবে।"
        confirmText="ঠিক আছে"
        cancelText="বাদ দিন"
        Icon={AlertCircle}
        variant="warning"
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </>
  );
}