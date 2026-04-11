"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, User as UserIcon, ArrowRight, Loader2, Smartphone, Upload, MapPin, X, CheckCircle, UserPlus, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react"; 

// অ্যাকশনসমূহ
import { registerUser } from "@/app/actions/users"; 
import { uploadImage } from "@/app/actions/uploadAction"; 

// ডাটা ফাইলসমূহ
import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    division: "",
    district: "",
    upazila: "",
    union: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState<any[]>([]);
  const [filteredUnions, setFilteredUnions] = useState<any[]>([]);

  // ফিল্টারিং লজিক (আগের মতোই ফিক্সড)
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value;
    const divName = divisionsData.find(d => d.id === divId)?.bn_name || "";
    setFormData({ ...formData, division: divName, district: "", upazila: "", union: "" });
    if (divId) setFilteredDistricts(districtsData.filter(d => d.division_id === divId));
    else setFilteredDistricts([]);
    setFilteredUpazilas([]);
    setFilteredUnions([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    const distName = districtsData.find(d => d.id === distId)?.bn_name || "";
    setFormData({ ...formData, district: distName, upazila: "", union: "" });
    if (distId) setFilteredUpazilas(upazilasData.filter(u => u.district_id === distId));
    else setFilteredUpazilas([]);
    setFilteredUnions([]);
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const upzId = e.target.value;
    const upzName = upazilasData.find(u => u.id === upzId)?.bn_name || "";
    setFormData({ ...formData, upazila: upzName, union: "" });
    if (upzId) {
      const unns = unionsData.filter(un => String(un.upazila_id) === String(upzId) || String(un.upazilla_id) === String(upzId));
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
        if (!formData.union) { toast.warning("ইউনিয়ন পর্যন্ত ঠিকানা দিন"); setLoading(false); return; }
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

  const inputClass = "w-full bg-slate-900/50 border border-white/10 rounded-2xl px-12 py-4 text-sm outline-none focus:border-yellow-500 focus:bg-slate-900 transition-all text-white placeholder:text-slate-500";
  const selectClass = "w-full bg-slate-900/50 border border-white/10 rounded-2xl px-12 py-4 text-sm outline-none focus:border-yellow-500 focus:bg-slate-900 transition-all text-white appearance-none cursor-pointer disabled:opacity-30";

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* ═══════════ BACKGROUND IMAGE & OVERLAY ═══════════ */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Background" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      </div>

      {/* ═══════════ AUTH CARD ═══════════ */}
      <div className={`relative z-10 w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'} bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-700`}>
        
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 rotate-3">
            {isLogin ? <LogIn className="text-black" size={30} /> : <UserPlus className="text-black" size={30} />}
          </div>
          <h2 className="text-3xl font-black text-white">{isLogin ? "স্বাগতম" : "নতুন মেম্বার"}</h2>
          <p className="text-xs text-slate-400 font-medium">ঈদের নামাজের সময়সূচি জানতে আপনার তথ্য দিন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin ? (
            /* ══════════ REGISTER FORM (Side by Side Grid) ══════════ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="text" placeholder="পূর্ণ নাম" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="relative">
                <label className={`${inputClass} flex items-center gap-3 cursor-pointer overflow-hidden border-dashed`}>
                  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                  <span className="truncate text-slate-400">{selectedFile ? selectedFile.name : "প্রোফাইল ছবি"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <select className={selectClass} onChange={handleDivisionChange} required>
                  <option value="">বিভাগ নির্বাচন</option>
                  {divisionsData.map((d: any) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <select className={selectClass} onChange={handleDistrictChange} disabled={!filteredDistricts.length} required>
                  <option value="">জেলা নির্বাচন</option>
                  {filteredDistricts.map((d: any) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <select className={selectClass} onChange={handleUpazilaChange} disabled={!filteredUpazilas.length} required>
                  <option value="">উপজেলা নির্বাচন</option>
                  {filteredUpazilas.map((u: any) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <select className={selectClass} onChange={(e) => setFormData({...formData, union: unionsData.find(un => un.id === e.target.value)?.bn_name || ""})} disabled={!filteredUnions.length} required>
                  <option value="">ইউনিয়ন নির্বাচন</option>
                  {filteredUnions.map((un: any) => <option key={un.id} value={un.id}>{un.bn_name}</option>)}
                </select>
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="tel" placeholder="মোবাইল নম্বর" className={inputClass} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="password" placeholder="পাসওয়ার্ড" className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>
          ) : (
            /* ══════════ LOGIN FORM (Single Column) ══════════ */
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="tel" placeholder="মোবাইল নম্বর" className={inputClass} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="password" placeholder="পাসওয়ার্ড" className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-[2rem] font-black shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-base">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "লগইন করুন" : "রেজিস্ট্রেশন করুন")}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-400 font-medium">
            {isLogin ? "একাউন্ট নেই?" : "ইতিমধ্যে একাউন্ট আছে?"}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-yellow-500 font-black hover:underline transition-all">
              {isLogin ? "নতুন খুলুন" : "লগইন করুন"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}