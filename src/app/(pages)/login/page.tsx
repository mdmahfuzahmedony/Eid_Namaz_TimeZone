"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // লোগোর জন্য
import { Phone, Lock, User as UserIcon, ArrowRight, Loader2, Upload, MapPin, Building2, Home } from "lucide-react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react"; 

import { registerUser } from "@/app/actions/users"; 
import { uploadImage } from "@/app/actions/uploadAction"; 

import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  // এরিয়া টাইপ সিলেক্ট করার স্টেট (ডিফল্ট ইউনিয়ন)
  const [areaType, setAreaType] = useState<"union" | "pourashava">("union");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    division: "",
    district: "",
    upazila: "",
    union: "",
    pourashava: "", // নতুন
    ward: "",       // নতুন
  });

  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState<any[]>([]);
  const [filteredUnions, setFilteredUnions] = useState<any[]>([]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value;
    const divName = divisionsData.find(d => d.id === divId)?.bn_name || "";
    setFormData({ ...formData, division: divName, district: "", upazila: "", union: "", pourashava: "", ward: "" });
    if (divId) setFilteredDistricts(districtsData.filter(d => d.division_id === divId));
    else setFilteredDistricts([]);
    setFilteredUpazilas([]);
    setFilteredUnions([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    const distName = districtsData.find(d => d.id === distId)?.bn_name || "";
    setFormData({ ...formData, district: distName, upazila: "", union: "", pourashava: "", ward: "" });
    if (distId) setFilteredUpazilas(upazilasData.filter(u => u.district_id === distId));
    else setFilteredUpazilas([]);
    setFilteredUnions([]);
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const upzId = e.target.value;
    const upzName = upazilasData.find(u => u.id === upzId)?.bn_name || "";
    
    // যদি পৌরসভা হয় তবে পৌরসভার নাম হিসেবে উপজেলার নামটাই যাবে
    if (areaType === "pourashava") {
      setFormData({ ...formData, upazila: upzName, pourashava: upzName, union: "" });
    } else {
      setFormData({ ...formData, upazila: upzName, union: "", pourashava: "" });
    }

    if (upzId) {
      const unns = unionsData.filter(un => String(un.upazilla_id) === String(upzId));
      setFilteredUnions(unns);
    } else setFilteredUnions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await signIn("credentials", { phoneNumber: formData.phoneNumber, password: formData.password, redirect: false });
        if (res?.error) toast.error("মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল!");
        else { toast.success("লগইন সফল!"); router.push("/"); router.refresh(); }
      } else {
        // এরিয়া অনুযায়ী ভ্যালিডেশন
        if (areaType === "union" && !formData.union) { 
          toast.warning("ইউনিয়ন পর্যন্ত ঠিকানা দিন"); 
          setLoading(false); 
          return; 
        }
        if (areaType === "pourashava" && !formData.ward) { 
          toast.warning("ওয়ার্ড নম্বর দিন"); 
          setLoading(false); 
          return; 
        }

        let imageUrl = "";
        if (selectedFile) {
          const upData = new FormData();
          upData.append("file", selectedFile);
          imageUrl = await uploadImage(upData) || "";
        }
        
        const res = await registerUser({ ...formData, image: imageUrl });
        if (res.success) { toast.success("রেজিস্ট্রেশন সফল!"); setIsLogin(true); }
        else toast.error(res.error || "কিছু একটা ভুল হয়েছে");
      }
    } catch (err) { toast.error("সার্ভার এরর!"); } finally { setLoading(false); }
  };

  const inputClass = "mt-1 w-full bg-[#1e293b]/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[13px] outline-none focus:border-yellow-500/50 transition-all text-white placeholder:text-slate-600 font-medium";
  const selectClass = "mt-1 w-full bg-[#1e293b]/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[13px] outline-none focus:border-yellow-500/50 transition-all text-white appearance-none cursor-pointer disabled:opacity-30 font-medium";
  const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1";

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" />
      </div>

      {/* অথ কার্ড */}
      <div className={`relative z-10 w-full ${isLogin ? 'max-w-[420px]' : 'max-w-[680px]'} bg-[#0f172a] p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500 my-10`}>
        
        {/* লোগো সেকশন */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4">
             <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                className="object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]" 
             />
          </div>
          <h2 className="text-xl font-black text-white italic">{isLogin ? "আবার স্বাগতম" : "নতুন একাউন্ট খুলুন"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin ? (
            /* ══════════════ রেজিস্ট্রেশন ফর্ম ══════════════ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label className={labelClass}><UserIcon size={12} /> আপনার নাম</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <input type="text" placeholder="এখানে লিখুন..." className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelClass}><Upload size={12} /> প্রোফাইল ছবি</label>
                <label className={`${inputClass} flex items-center gap-3 cursor-pointer overflow-hidden border-dashed border-white/10`}>
                  <span className="truncate text-slate-600 ml-2">{selectedFile ? selectedFile.name : "সিলেক্ট করুন..."}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              {/* এরিয়া টাইপ টগল বাটন */}
              <div className="md:col-span-2 flex justify-center gap-3 my-2">
                <button 
                  type="button"
                  onClick={() => setAreaType("union")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${areaType === "union" ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
                >
                  <Home size={14} /> গ্রাম / ইউনিয়ন
                </button>
                <button 
                  type="button"
                  onClick={() => setAreaType("pourashava")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${areaType === "pourashava" ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
                >
                  <Building2 size={14} /> শহর / পৌরসভা
                </button>
              </div>

              <div className="flex flex-col">
                <label className={labelClass}><MapPin size={12} /> বিভাগ</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <select className={selectClass} onChange={handleDivisionChange} required>
                    <option value="" className="bg-slate-900">সিলেক্ট বিভাগ</option>
                    {divisionsData.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{d.bn_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelClass}><MapPin size={12} /> জেলা</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <select className={selectClass} onChange={handleDistrictChange} disabled={!filteredDistricts.length} required>
                    <option value="" className="bg-slate-900">সিলেক্ট জেলা</option>
                    {filteredDistricts.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{d.bn_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelClass}><MapPin size={12} /> {areaType === "union" ? "উপজেলা" : "উপজেলা / পৌরসভা"}</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <select className={selectClass} onChange={handleUpazilaChange} disabled={!filteredUpazilas.length} required>
                    <option value="" className="bg-slate-900">সিলেক্ট করুন</option>
                    {filteredUpazilas.map((u: any) => <option key={u.id} value={u.id} className="bg-slate-900">{u.bn_name}</option>)}
                  </select>
                </div>
              </div>

              {/* কন্ডিশনাল ইনপুট: ইউনিয়ন অথবা ওয়ার্ড */}
              {areaType === "union" ? (
                <div className="flex flex-col">
                  <label className={labelClass}><MapPin size={12} /> ইউনিয়ন</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                    <select className={selectClass} onChange={(e) => setFormData({...formData, union: unionsData.find(un => un.id === e.target.value)?.bn_name || ""})} disabled={!filteredUnions.length} required>
                      <option value="" className="bg-slate-900">সিলেক্ট ইউনিয়ন</option>
                      {filteredUnions.map((un: any) => <option key={un.id} value={un.id} className="bg-slate-900">{un.bn_name}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <label className={labelClass}><MapPin size={12} /> ওয়ার্ড নং</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                    <input 
                      type="text" 
                      placeholder="যেমন: ওয়ার্ড ৫ বা ০৯" 
                      className={inputClass} 
                      value={formData.ward}
                      onChange={(e) => setFormData({...formData, ward: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                <label className={labelClass}><Phone size={12} /> মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <input type="tel" placeholder="০১৭XXXXXXXX" className={inputClass} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelClass}><Lock size={12} /> পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <input type="password" placeholder="******" className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════ লগইন ফর্ম ══════════════ */
            <div className="space-y-5 max-w-[340px] mx-auto w-full">
              <div className="flex flex-col">
                <label className={labelClass}><Phone size={12} /> মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <input type="tel" placeholder="০১৭XXXXXXXX" className={inputClass} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                </div>
              </div>
              <div className="flex flex-col">
                <label className={labelClass}><Lock size={12} /> পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                  <input type="password" placeholder="******" className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full max-w-[340px] mx-auto bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-black shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm mt-6">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "লগইন করুন" : "রেজিস্ট্রেশন করুন")}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* টগল বাটন */}
        <div className="text-center mt-10">
          <p className="text-[12px] text-slate-500 font-bold">
            {isLogin ? "একাউন্ট নেই?" : "ইতিমধ্যে একাউন্ট আছে?"}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-yellow-500 font-black hover:text-yellow-400 transition-all border-b border-yellow-500/20">
              {isLogin ? "নতুন একাউন্ট খুলুন" : "লগইন করুন"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}