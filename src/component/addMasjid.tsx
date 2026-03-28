"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMasjid } from "@/app/actions/masjidActions"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { MapPin, Image as ImageIcon, User, Clock, Building2, Loader2, ChevronRight, Hash } from "lucide-react";

import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

interface Division { id: string; bn_name: string; }
interface District { id: string; division_id: string; bn_name: string; }
interface Upazila { id: string; district_id: string; bn_name: string; }
interface Union { id: string; upazilla_id: string; bn_name: string; }

const allDivisions = divisionsData as Division[];
const allDistricts = districtsData as District[];
const allUpazilas = upazilasData as Upazila[];
const allUnions = unionsData as Union[];

export default function AddMasjid() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ফর্ম স্টেট
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [unionId, setUnionId] = useState("");
  const [gram, setGram] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("মসজিদ");
  const [imamName, setImamName] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [jamaat1, setJamaat1] = useState("");
  const [jamaat2, setJamaat2] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);

  useEffect(() => {
    if (!divisionId) { setDistricts([]); return; }
    setDistricts(allDistricts.filter((d) => d.division_id === divisionId));
    setDistrictId(""); setUpazilas([]); setUpazilaId("");
    setUnions([]); setUnionId("");
  }, [divisionId]);

  useEffect(() => {
    if (!districtId) { setUpazilas([]); return; }
    setUpazilas(allUpazilas.filter((u) => u.district_id === districtId));
    setUpazilaId(""); setUnions([]); setUnionId("");
  }, [districtId]);

  useEffect(() => {
    if (!upazilaId) { setUnions([]); return; }
    setUnions(allUnions.filter((u) => u.upazilla_id === upazilaId));
    setUnionId("");
  }, [upazilaId]);

  const handleSubmit = async () => {
    if (!name || !districtId || !jamaat1) {
      toast.warning("প্রয়োজনীয় তথ্যগুলো পূরণ করুন");
      return;
    }
    setLoading(true);
    try {
      const result = await createMasjid({
        name, type, imamName, mapLink, imageUrl, jamaat1, jamaat2,
        divisionId, districtId, upazilaId, unionId, gram,
        divisionName: allDivisions.find((d) => d.id === divisionId)?.bn_name || "",
        districtName: allDistricts.find((d) => d.id === districtId)?.bn_name || "",
        upazilaName: allUpazilas.find((u) => u.id === upazilaId)?.bn_name || "",
        unionName: allUnions.find((u) => u.id === unionId)?.bn_name || "",
      });
      if (result.success) {
        toast.success("সফলভাবে যোগ করা হয়েছে! হোমে রিডাইরেক্ট করা হচ্ছে...");
        setTimeout(() => router.push("/"), 2500);
      } else {
        toast.error("ভুল হয়েছে: " + result.error);
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // থিম ভিত্তিক ইয়েলো ক্লাসসমূহ
  const inputContainer = "relative flex flex-col w-full";
  const inputClass = "mt-1.5 w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#facc15] focus:ring-4 focus:ring-[#facc15]/10 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-all hover:border-[#facc15]/50";
  const selectClass = "mt-1.5 w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#facc15]/10 focus:border-[#facc15] bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 disabled:opacity-40 transition-all cursor-pointer hover:border-[#facc15]/50 appearance-none";
  const labelClass = "text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 ml-1";

  return (
    <div className="bg-transparent px-2 py-4">
      {/* ── ব্রাউজারের ডিফল্ট নীল রঙ সরানোর স্টাইল ── */}
      <style>{`
        select option {
          background-color: #1e293b !important;
          color: white !important;
        }
        /* Tap highlight color remove for mobile */
        * { -webkit-tap-highlight-color: transparent; }
        
        input:focus, select:focus {
            box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1) !important;
            border-color: #facc15 !important;
        }
      `}</style>

      <ToastContainer theme="colored" position="top-center" autoClose={2500} />

      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#facc15]/10 rounded-2xl flex items-center justify-center text-[#facc15] mb-4 shadow-lg shadow-[#facc15]/5 border border-[#facc15]/20">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">নতুন তথ্য যোগ করুন</h1>
          <p className="text-xs text-gray-500 mt-1">সঠিক তথ্য দিয়ে অন্যকে সাহায্য করুন</p>
        </div>

        <div className="space-y-5">
          {/* নাম ও ধরন - মোবাইল ভিউতে স্ট্যাক হবে */}
          <div className="flex flex-col gap-4">
            <div className={inputContainer}>
              <label className={labelClass}><Building2 size={12}/> প্রতিষ্ঠানের নাম *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="উদা: বাইতুল মামুর মসজিদ" className={inputClass} />
            </div>
            <div className={inputContainer}>
              <label className={labelClass}><Hash size={12}/> ধরন নির্বাচন করুন *</label>
              <div className="relative">
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                  <option value="মসজিদ">মসজিদ</option>
                  <option value="ঈদগাহ">ঈদগাহ</option>
                  <option value="মাঠ">মাঠ</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* লোকেশন কার্ড */}
          <div className="bg-gray-50/50 dark:bg-[#0f172a]/40 p-5 rounded-3xl border border-gray-100 dark:border-slate-800/50 space-y-4 shadow-inner">
            <h2 className="text-[10px] font-black text-[#facc15] flex items-center gap-2 uppercase tracking-[0.2em] mb-2">
              <MapPin size={12} /> লোকেশন ডিটেইলস
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={inputContainer}>
                <label className={labelClass}>বিভাগ</label>
                <select value={divisionId} onChange={(e) => setDivisionId(e.target.value)} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {allDivisions.map((d) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>
              <div className={inputContainer}>
                <label className={labelClass}>জেলা *</label>
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={!divisionId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>
              <div className={inputContainer}>
                <label className={labelClass}>উপজেলা</label>
                <select value={upazilaId} onChange={(e) => setUpazilaId(e.target.value)} disabled={!districtId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {upazilas.map((u) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
                </select>
              </div>
              <div className={inputContainer}>
                <label className={labelClass}>ইউনিয়ন</label>
                <select value={unionId} onChange={(e) => setUnionId(e.target.value)} disabled={!upazilaId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {unions.map((u) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
                </select>
              </div>
            </div>
            <div className={inputContainer}>
              <label className={labelClass}><MapPin size={12}/> গ্রাম / এলাকা</label>
              <input value={gram} onChange={(e) => setGram(e.target.value)} placeholder="উদা: উত্তর পাড়া" className={inputClass} />
            </div>
          </div>

          {/* ইমাম ও সময় */}
          <div className="flex flex-col gap-4">
            <div className={inputContainer}>
              <label className={labelClass}><User size={12}/> ইমামের নাম (ঐচ্ছিক)</label>
              <input value={imamName} onChange={(e) => setImamName(e.target.value)} placeholder="ইমামের নাম লিখুন" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={inputContainer}>
                <label className={labelClass}><Clock size={12}/> ১ম জামাত *</label>
                <input type="time" value={jamaat1} onChange={(e) => setJamaat1(e.target.value)} className={inputClass} />
              </div>
              <div className={inputContainer}>
                <label className={labelClass}><Clock size={12}/> ২য় জামাত</label>
                <input type="time" value={jamaat2} onChange={(e) => setJamaat2(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* লিংক সমূহ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={inputContainer}>
              <label className={labelClass}><MapPin size={12}/> গুগল ম্যাপ লিংক</label>
              <input value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="লিংক পেস্ট করুন" className={inputClass} />
            </div>
            <div className={inputContainer}>
              <label className={labelClass}><ImageIcon size={12}/> ছবির ইউআরএল</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="ছবির ডিরেক্ট লিংক" className={inputClass} />
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#facc15] hover:bg-[#eab308] text-gray-900 py-4 rounded-2xl text-base font-black transition-all shadow-xl shadow-[#facc15]/20 active:scale-[0.96] disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 disabled:cursor-not-allowed group mt-6"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /><span>তথ্য আপলোড হচ্ছে...</span></>
            ) : (
              <><span>তথ্য জমা দিন</span><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>

          
        </div>

        
      </div>
    </div>
  );
}