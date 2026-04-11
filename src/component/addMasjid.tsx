"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMasjid, updateMasjid } from "@/app/actions/masjidActions"; 
import { uploadImage } from "@/app/actions/uploadAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Clock, Building2, Loader2, Hash, Save, Send, Upload, X, MapPin, Map as MapIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

interface Props { 
  language?: "bn" | "en"; 
  editData?: any; 
  onSuccess?: () => void; 
}

export default function AddMasjid({ language = "bn", editData, onSuccess }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duplicateOwner, setDuplicateOwner] = useState<{name: string, image: string} | null>(null);

  const [divisionId, setDivisionId] = useState(editData?.divisionId || "");
  const [districtId, setDistrictId] = useState(editData?.districtId || "");
  const [upazilaId,  setUpazilaId]  = useState(editData?.upazilaId || "");
  const [unionId,    setUnionId]    = useState(editData?.unionId || "");
  const [gram,       setGram]       = useState(editData?.gram || "");
  const [name,       setName]       = useState(editData?.name || "");
  const [type,       setType]       = useState(editData?.type || "মসজিদ");
  const [imamName,   setImamName]   = useState(editData?.imamName || "");
  const [mapLink,    setMapLink]    = useState(editData?.mapLink || "");
  const [jamaat1,    setJamaat1]    = useState(editData?.jamaat1 || "");
  const [jamaat2,    setJamaat2]    = useState(editData?.jamaat2 || "");

  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas,  setUpazilas]  = useState<any[]>([]);
  const [unions,    setUnions]    = useState<any[]>([]);

  useEffect(() => {
    if (!divisionId) { setDistricts([]); return; }
    setDistricts(districtsData.filter((d: any) => d.division_id === divisionId));
  }, [divisionId]);

  useEffect(() => {
    if (!districtId) { setUpazilas([]); return; }
    setUpazilas(upazilasData.filter((u: any) => u.district_id === districtId));
  }, [districtId]);

  useEffect(() => {
    if (!upazilaId) { setUnions([]); return; }
    setUnions(unionsData.filter((u: any) => u.upazilla_id === upazilaId));
  }, [upazilaId]);

  const bn = language === "bn";
  const nameOf = (item: any) => (language === "en" && item.name) ? item.name : item.bn_name;

  const handleSubmit = async (publishStatus: boolean) => {
    const userId = (session?.user as any)?.id;
    if (!userId) { toast.error("দয়া করে আবার লগইন করুন!"); return; }

    // ═══════════ কঠোর ভ্যালিডেশন (Draft & Publish উভয়ের জন্য) ═══════════
    
    // ১. নাম, ঠিকানা, ম্যাপ লিংক এবং ইমেজ বাধ্যতামূলক
    const isImageMissing = !selectedFile && !editData?.imageUrl;
    
    if (!name || !divisionId || !districtId || !upazilaId || !unionId || !mapLink || isImageMissing) {
      toast.warning("নাম, পূর্ণ ঠিকানা, ম্যাপ লিংক এবং ছবি অবশ্যই দিতে হবে");
      return;
    }

    // ২. পাবলিশ করতে হলে ইমামের নাম এবং সময় বাধ্যতামূলক
    if (publishStatus && (!imamName || !jamaat1)) {
      toast.warning("সরাসরি পাবলিশ করতে ইমামের নাম এবং নামাজের সময় দিন");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = editData?.imageUrl || "";
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        finalImageUrl = await uploadImage(uploadData) || finalImageUrl;
      }

      const masjidData = {
        name, type, imamName, mapLink, 
        imageUrl: finalImageUrl,
        jamaat1, jamaat2,
        divisionId, districtId, upazilaId, unionId, gram,
        divisionName: divisionsData.find((d: any) => d.id === divisionId)?.bn_name || "",
        districtName: districtsData.find((d: any) => d.id === districtId)?.bn_name || "",
        upazilaName:  upazilasData.find((u: any) => u.id === upazilaId)?.bn_name  || "",
        unionName:    unionsData.find((u: any) => u.id === unionId)?.bn_name       || "",
        isPublished:  publishStatus,
        userId:       userId,
      };

      let result = editData ? await updateMasjid(editData.id, masjidData) : await createMasjid(masjidData);

      if (!result.success && result.isDuplicate) {
        setDuplicateOwner(result.owner);
      } else if (result.success) {
        toast.success(publishStatus ? "সফলভাবে পাবলিশ হয়েছে!" : "খসড়া হিসেবে সেভ হয়েছে!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("সার্ভার সমস্যা!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1.5 w-full border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-yellow-500 bg-[#0f172a] text-white transition-all";
  const selectClass = "mt-1.5 w-full border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 bg-[#0f172a] text-white disabled:opacity-30 appearance-none transition-all cursor-pointer";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2";

  return (
    <div className="bg-transparent px-2 py-4">
   
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* নাম ও ধরন */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className={labelClass}><Building2 size={12} /> নাম *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="প্রতিষ্ঠানের নাম" className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}><Hash size={12} /> ধরন নির্বাচন করুন *</label>
            <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
              {["মসজিদ", "ঈদগাহ", "মাঠ"].map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
            </select>
          </div>
        </div>

        {/* ঠিকানা সেকশন */}
        <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 space-y-5 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>বিভাগ *</label>
              <select value={divisionId} onChange={e => setDivisionId(e.target.value)} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট বিভাগ</option>
                {divisionsData.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{nameOf(d)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>জেলা *</label>
              <select value={districtId} onChange={e => setDistrictId(e.target.value)} disabled={!divisionId} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট জেলা</option>
                {districts.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{nameOf(d)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>উপজেলা *</label>
              <select value={upazilaId} onChange={e => setUpazilaId(e.target.value)} disabled={!districtId} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট উপজেলা</option>
                {upazilas.map((u: any) => <option key={u.id} value={u.id} className="bg-slate-900">{nameOf(u)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>ইউনিয়ন *</label>
              <select value={unionId} onChange={e => setUnionId(e.target.value)} disabled={!upazilaId} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট ইউনিয়ন</option>
                {unions.map((u: any) => <option key={u.id} value={u.id} className="bg-slate-900">{nameOf(u)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col">
             <label className={labelClass}><MapPin size={12}/> গ্রাম / মহল্লা</label>
             <input value={gram} onChange={e => setGram(e.target.value)} placeholder="গ্রামের নাম লিখুন" className={inputClass} />
          </div>
        </div>

        {/* ম্যাপ ও ইমেজ (এখন ড্রাফট এর জন্যও বাধ্যতামূলক) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div className="flex flex-col">
              <label className={labelClass}><MapIcon size={12}/> গুগল ম্যাপ লিংক *</label>
              <input value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="লিংক পেস্ট করুন" className={inputClass} />
           </div>
           <div className="flex flex-col">
              <label className={labelClass}><Upload size={12}/> ছবি আপলোড করুন *</label>
              <label className={`${inputClass} flex items-center gap-3 cursor-pointer overflow-hidden border-dashed`}>
                <Upload size={18} className="text-yellow-500 shrink-0" />
                <span className="truncate text-slate-400">{selectedFile ? selectedFile.name : (editData?.imageUrl ? "ছবি দেওয়া আছে" : "একটি ছবি সিলেক্ট করুন")}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </label>
           </div>
        </div>

        {/* ইমাম ও সময় */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
           <div className="flex flex-col">
              <label className={labelClass}><User size={12} /> ইমামের নাম</label>
              <input value={imamName} onChange={e => setImamName(e.target.value)} placeholder="ইমামের নাম" className={inputClass} />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}><Clock size={12} /> ১ম জামাত</label>
                <input type="time" value={jamaat1} onChange={e => setJamaat1(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Clock size={12} /> ২য় জামাত</label>
                <input type="time" value={jamaat2} onChange={e => setJamaat2(e.target.value)} className={inputClass} />
              </div>
           </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
           <button onClick={() => handleSubmit(false)} disabled={loading} className="w-full bg-slate-800 text-slate-400 py-5 rounded-[2rem] font-bold hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50">
             {loading ? <Loader2 className="animate-spin mx-auto" /> : "খসড়া হিসেবে রাখুন"}
           </button>
           <button onClick={() => handleSubmit(true)} disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-[2rem] font-black shadow-xl shadow-yellow-500/10 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
             পাবলিশ করুন
           </button>
        </div>
      </div>

      {/* ডুপ্লিকেট মডাল আগের মতোই থাকবে */}
      {duplicateOwner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Building2 className="text-yellow-500" size={44} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">ইতিমধ্যে আছে!</h2>
            <div className="bg-white/5 p-4 rounded-[2rem] flex items-center gap-4 mb-8 border border-white/5 shadow-inner mt-4">
              <img src={duplicateOwner.image || "/profile.png"} className="w-14 h-14 rounded-2xl object-cover border-2 border-yellow-500 shadow-lg" alt="User" />
              <div className="text-left">
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">যোগ করেছেন</p>
                <p className="font-bold text-white text-base">{duplicateOwner.name}</p>
              </div>
            </div>
            <button onClick={() => setDuplicateOwner(null)} className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black shadow-lg hover:bg-yellow-400 transition-all active:scale-95">
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}