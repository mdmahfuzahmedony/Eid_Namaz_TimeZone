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
          
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => router.push("/")}>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-110" />
            </div>
            <div className="hidden xs:block text-white font-bold text-xs sm:text-sm leading-tight hero-text-shadow font-serif">
              ঈদের নামাজ <br /> <span className="text-yellow-500">সময়সূচি</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* থিম মেনু বাটন এবং ড্রপডাউন */}
            <div className="relative">
              <button 
                onClick={() => {setShowThemeMenu(!showThemeMenu); setShowDropdown(false);}}
                className="w-10 h-10 rounded-xl border-2 border-white/20 overflow-hidden bg-black/40 flex items-center justify-center group"
              >
                {currentBg ? (
                  <img src={currentBg} alt="Theme" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <ImageIcon size={20} className="text-white" />
                )}
              </button>

              {/* ══════════════ ড্রপডাউন পজিশন ফিক্সড করা হয়েছে ══════════════ */}

{showThemeMenu && (
  <div 
    className="absolute right-0 mt-3 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 z-[70] animate-in fade-in slide-in-from-top-2 duration-200 
    /* ════════ মোবাইল ফিক্স ════════ */
    max-w-[calc(100vw-32px)] origin-top-right"
  >
    {/* মেনু কন্টেন্ট */}
    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2 text-white font-black">
      <p className="text-[10px] uppercase opacity-70 tracking-widest">থিম মেনু</p>
      <Clock size={10} className="text-yellow-500" />
    </div>
    
    {/* ইমেজের গ্রিড */}
    <div className="grid grid-cols-5 gap-2 mb-4">
      {defaultImages.map((img, index) => (
        <img 
          key={index} 
          src={img} 
          onClick={() => applyBg(img)} 
          className={`w-full h-10 object-cover rounded-lg cursor-pointer border-2 transition-all ${
            currentBg === img ? 'border-yellow-500 scale-105 shadow-lg shadow-yellow-500/20' : 'border-white/10'
          }`} 
        />
      ))}
    </div>

    {customImages.length > 0 && (
      <div className="grid grid-cols-5 gap-2 mb-4">
        {customImages.map((img, index) => (
          <img 
            key={index} 
            src={img.url} 
            onClick={() => applyBg(img.url)} 
            className={`w-full h-10 object-cover rounded-lg cursor-pointer border-2 transition-all ${
              currentBg === img.url ? 'border-yellow-500 scale-105' : 'border-white/10'
            }`} 
          />
        ))}
      </div>
    )}

    {/* বাটন */}
    <button 
      onClick={() => {setShowWarningModal(true); setShowThemeMenu(false);}}
      className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-xs font-black transition-all shadow-lg active:scale-95"
    >
      <Plus size={14} /> ফটো যোগ করুন
    </button>
  </div>
)} 
            </div>

            {session ? (
              <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-xl border-2 border-yellow-500 overflow-hidden bg-slate-800">
                  <img src={session.user?.image || "/profile.png"} className="w-full h-full object-cover" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
                      <UserCircle size={18} className="text-yellow-500" /> প্রোফাইল
                    </Link>
                    <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 border-t border-white/5 text-left font-bold hover:bg-red-500/5">
                      <LogOut size={18} /> 
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleAddClick} className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95">
                <Plus size={16} className="mr-1 inline-block" /> মসজিদ যোগ
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