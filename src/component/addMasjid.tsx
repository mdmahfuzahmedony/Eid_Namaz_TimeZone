"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMasjid, updateMasjid } from "@/app/actions/masjidActions"; 
import { uploadImage } from "@/app/actions/uploadAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Clock, Building2, Loader2, Hash, Save, Send, Upload, X, MapPin, Map as MapIcon, Home, Building } from "lucide-react";
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
  
  // নতুন স্টেট: শহর না গ্রাম মোড
  const [isCityMode, setIsCityMode] = useState(editData?.isCityMode || false);
  const [unionId,    setUnionId]    = useState(editData?.unionId || "");
  const [paurashava, setPaurashava] = useState(editData?.paurashava || ""); // পৌরসভার নাম

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

  const nameOf = (item: any) => (language === "en" && item.name) ? item.name : item.bn_name;

  const handleSubmit = async (publishStatus: boolean) => {
    const userId = (session?.user as any)?.id;
    if (!userId) { toast.error("দয়া করে আবার লগইন করুন!"); return; }

    // স্পেস ক্লিন করার লজিক
    const clean = (str: string) => str.trim().replace(/\s+/g, ' ');

    const cleanedName = clean(name);
    const cleanedGram = clean(gram);
    const cleanedImam = clean(imamName);
    const cleanedPaurashava = clean(paurashava);

    const isImageMissing = !selectedFile && !editData?.imageUrl;
    
    // ভ্যালিডেশন চেক
    const unionPart = isCityMode ? cleanedPaurashava : unionId;
    if (!cleanedName || !divisionId || !districtId || !upazilaId || !unionPart || !mapLink || isImageMissing) {
      toast.warning("নাম, পূর্ণ ঠিকানা, ম্যাপ লিংক এবং ছবি অবশ্যই দিতে হবে");
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
        name: cleanedName,
        type,
        imamName: cleanedImam,
        mapLink: mapLink.trim(),
        imageUrl: finalImageUrl,
        jamaat1,
        jamaat2,
        divisionId, districtId, upazilaId,
        isCityMode, // শহর না গ্রাম মোড ডাটাবেজে যাবে
        unionId: isCityMode ? "" : unionId, // গ্রাম হলে আইডি, শহর হলে খালি
        unionName: isCityMode ? cleanedPaurashava : unionsData.find((u: any) => u.id === unionId)?.bn_name || "",
        gram: cleanedGram,
        divisionName: divisionsData.find((d: any) => d.id === divisionId)?.bn_name || "",
        districtName: districtsData.find((d: any) => d.id === districtId)?.bn_name || "",
        upazilaName:  upazilasData.find((u: any) => u.id === upazilaId)?.bn_name  || "",
        isPublished:  publishStatus,
        userId:       userId,
      };

      const result:any = editData ? await updateMasjid(editData.id, masjidData) : await createMasjid(masjidData);

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

  const inputClass = "mt-1 w-full border border-white/5 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-yellow-500/50 bg-slate-800/40 text-white transition-all placeholder:text-slate-600 font-medium";
  const selectClass = "mt-1 w-full border border-white/5 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-yellow-500/50 bg-slate-800/40 text-white disabled:opacity-30 appearance-none transition-all cursor-pointer font-medium";
  const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1";

  return (
    <div className="bg-transparent px-2 py-2">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* নাম ও ধরন */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className={labelClass}><Building2 size={13} /> নাম লিখুন *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ঈদগাহ বা মসজিদের নাম" className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}><Hash size={13} /> ধরন নির্বাচন করুন *</label>
            <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
              {["মসজিদ", "ঈদগাহ", "মাঠ"].map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
            </select>
          </div>
        </div>

        {/* ঠিকানা সেকশন */}
        <div className="bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
          
          {/* গ্রাম/শহর মোড সুইচ */}
          <div className="flex justify-center gap-3 p-1 bg-slate-800/50 rounded-2xl w-fit mx-auto border border-white/5">
            <button 
              onClick={() => setIsCityMode(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${!isCityMode ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-500'}`}
            >
              <Home size={12} /> গ্রাম / ইউনিয়ন
            </button>
            <button 
              onClick={() => setIsCityMode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${isCityMode ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-500'}`}
            >
              <Building size={12} /> শহর / পৌরসভা
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>বিভাগ *</label>
              <select value={divisionId} onChange={e => setDivisionId(e.target.value)} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট করুন</option>
                {divisionsData.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{nameOf(d)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>জেলা *</label>
              <select value={districtId} onChange={e => setDistrictId(e.target.value)} disabled={!divisionId} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট করুন</option>
                {districts.map((d: any) => <option key={d.id} value={d.id} className="bg-slate-900">{nameOf(d)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>উপজেলা *</label>
              <select value={upazilaId} onChange={e => setUpazilaId(e.target.value)} disabled={!districtId} className={selectClass}>
                <option value="" className="bg-slate-900">সিলেক্ট করুন</option>
                {upazilas.map((u: any) => <option key={u.id} value={u.id} className="bg-slate-900">{nameOf(u)}</option>)}
              </select>
            </div>

            {/* ডাইনামিক ফিল্ড: ইউনিয়ন অথবা পৌরসভা */}
            <div>
              {isCityMode ? (
                <>
                  <label className={labelClass}>পৌরসভা / এলাকা *</label>
                  <input 
                    value={paurashava} 
                    onChange={e => setPaurashava(e.target.value)} 
                    placeholder="পৌরসভার নাম লিখুন" 
                    className={inputClass} 
                  />
                </>
              ) : (
                <>
                  <label className={labelClass}>ইউনিয়ন *</label>
                  <select value={unionId} onChange={e => setUnionId(e.target.value)} disabled={!upazilaId} className={selectClass}>
                    <option value="" className="bg-slate-900">সিলেক্ট করুন</option>
                    {unions.map((u: any) => <option key={u.id} value={u.id} className="bg-slate-900">{nameOf(u)}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col">
             <label className={labelClass}><MapPin size={13}/> {isCityMode ? "ওয়ার্ড / পাড়া / মহল্লা" : "গ্রাম / মহল্লা"}</label>
             <input value={gram} onChange={e => setGram(e.target.value)} placeholder="বিস্তারিত নাম লিখুন..." className={inputClass} />
          </div>
        </div>

        {/* ম্যাপ ও ইমেজ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col">
              <label className={labelClass}><MapIcon size={13}/> গুগল ম্যাপ লিংক *</label>
              <input value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="লিংক পেস্ট করুন" className={inputClass} />
           </div>
           <div className="flex flex-col">
              <label className={labelClass}><Upload size={13}/> ছবি আপলোড *</label>
              <label className={`${inputClass} flex items-center gap-3 cursor-pointer overflow-hidden border-dashed border-white/10`}>
                <Upload size={16} className="text-yellow-500 shrink-0" />
                <span className="truncate text-slate-500 text-[12px]">{selectedFile ? selectedFile.name : (editData?.imageUrl ? "ছবি দেওয়া আছে" : "ছবি সিলেক্ট করুন")}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </label>
           </div>
        </div>

        {/* ইমাম ও সময় */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col">
              <label className={labelClass}><User size={13} /> ইমামের নাম</label>
              <input value={imamName} onChange={e => setImamName(e.target.value)} placeholder="ইমামের নাম লিখুন" className={inputClass} />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}><Clock size={13} /> ১ম জামাত</label>
                <input type="time" value={jamaat1} onChange={e => setJamaat1(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Clock size={13} /> ২য় জামাত</label>
                <input type="time" value={jamaat2} onChange={e => setJamaat2(e.target.value)} className={inputClass} />
              </div>
           </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
           <button onClick={() => handleSubmit(false)} disabled={loading} className="w-full bg-slate-800/60 text-slate-400 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50">
             {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "খসড়া হিসেবে রাখুন"}
           </button>
           <button onClick={() => handleSubmit(true)} disabled={loading} className="w-full bg-yellow-500 text-black py-3.5 rounded-xl text-sm font-black shadow-lg shadow-yellow-500/5 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={16} />}
             পাবলিশ করুন
           </button>
        </div>
      </div>

      {/* ডুপ্লিকেট মডাল */}
      {duplicateOwner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <Building2 className="text-yellow-500" size={36} />
            </div>
            <h2 className="text-xl font-black text-white mb-1">ইতিমধ্যে আছে!</h2>
            <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-3 mb-6 border border-white/5 mt-4">
              <img src={duplicateOwner.image || "/profile.png"} className="w-12 h-12 rounded-xl object-cover border-2 border-yellow-500" alt="User" />
              <div className="text-left">
                <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest">যোগ করেছেন</p>
                <p className="font-bold text-white text-sm">{duplicateOwner.name}</p>
              </div>
            </div>
            <button onClick={() => setDuplicateOwner(null)} className="w-full bg-yellow-500 text-black py-3.5 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition-all">
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}