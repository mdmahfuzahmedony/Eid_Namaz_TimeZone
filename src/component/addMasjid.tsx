"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMasjid } from "@/app/actions/masjidActions"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { MapPin, Image as ImageIcon, User, Clock, Building2, Loader2, ChevronRight } from "lucide-react";

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
      toast.warning("প্রয়োজনীয় তথ্যগুলো পূরণ করুন");
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
        toast.success("সফলভাবে যোগ করা হয়েছে! হোমে রিডাইরেক্ট করা হচ্ছে...");
        setTimeout(() => router.push("/"), 2500);
      } else {
        toast.error("ভুল হয়েছে: " + result.error);
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // থিম ভিত্তিক ইয়েলো ক্লাসসমূহ
  const inputClass = "mt-1.5 w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/20 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-all";
  const selectClass = "mt-1.5 w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 disabled:opacity-40 transition-all cursor-pointer";
  const labelClass = "text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 ml-1";

  return (
    <div className="bg-transparent px-2 py-6">
      {/* ── ব্রাউজারের নীল রঙ সরানোর জন্য অতিরিক্ত CSS ── */}
      <style>{`
        /* অপশন ট্যাগগুলোকে থিমের ডার্ক কালার দেওয়া */
        select option {
          background-color: #0f172a !important;
          color: white !important;
          padding: 10px;
        }

        /* ফোকাস করলে নীল আউটলাইন রিমুভ করা */
        select:focus, input:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.2) !important;
        }

        /* উইন্ডোজ ব্রাউজারে সিলেকশন কালার চেঞ্জ করার চেষ্টা */
        select::-ms-expand { display: none; }
        
        /* কিছু ব্রাউজারে অপশন সিলেকশন ফিক্স */
        select option:checked {
          background: #facc15 linear-gradient(0deg, #facc15 0%, #facc15 100%) !important;
          color: black !important;
        }
      `}</style>

      <ToastContainer theme="colored" position="top-center" autoClose={2500} />

      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#facc15]/10 rounded-2xl flex items-center justify-center text-[#facc15]">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">নতুন তথ্য যোগ করুন</h1>
            <p className="text-xs text-gray-500">আপনার এলাকার সঠিক তথ্য দিয়ে সহযোগিতা করুন</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* নাম ও ধরন */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}><Building2 size={13}/> নাম *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="নাম লিখুন" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>ধরন *</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                <option value="মসজিদ">মসজিদ</option>
                <option value="ঈদগাহ">ঈদগাহ</option>
                <option value="মাঠ">মাঠ</option>
              </select>
            </div>
          </div>

          {/* লোকেশন কার্ড */}
          <div className="bg-gray-50 dark:bg-[#0f172a]/40 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-black text-[#facc15] flex items-center gap-2 uppercase tracking-tighter">
              <MapPin size={14} /> লোকেশন ডিটেইলস
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>বিভাগ</label>
                <select value={divisionId} onChange={(e) => setDivisionId(e.target.value)} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {allDivisions.map((d) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>জেলা *</label>
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={!divisionId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>উপজেলা</label>
                <select value={upazilaId} onChange={(e) => setUpazilaId(e.target.value)} disabled={!districtId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {upazilas.map((u) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>ইউনিয়ন</label>
                <select value={unionId} onChange={(e) => setUnionId(e.target.value)} disabled={!upazilaId} className={selectClass}>
                  <option value="">সিলেক্ট করুন</option>
                  {unions.map((u) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}><MapPin size={13}/> গ্রাম / এলাকা</label>
              <input value={gram} onChange={(e) => setGram(e.target.value)} placeholder="গ্রামের নাম" className={inputClass} />
            </div>
          </div>

          {/* ইমাম ও সময় */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}><User size={13}/> ইমামের নাম (ঐচ্ছিক)</label>
              <input value={imamName} onChange={(e) => setImamName(e.target.value)} placeholder="ইমামের নাম লিখুন" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}><Clock size={13}/> ১ম জামাত *</label>
                <input type="time" value={jamaat1} onChange={(e) => setJamaat1(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Clock size={13}/> ২য় জামাত</label>
                <input type="time" value={jamaat2} onChange={(e) => setJamaat2(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* লিংক সমূহ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}><MapPin size={13}/> গুগল ম্যাপ লিংক</label>
              <input value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="গুগল ম্যাপ লিংক (ঐচ্ছিক)" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><ImageIcon size={13}/> ছবির ইউআরএল</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="ছবির ডিরেক্ট লিংক (ঐচ্ছিক)" className={inputClass} />
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#facc15] hover:bg-[#eab308] text-gray-900 py-4 rounded-2xl text-base font-black transition-all shadow-[0_10px_20px_rgba(250,204,21,0.2)] active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /><span>অপেক্ষা করুন...</span></>
            ) : (
              <><span>তথ্য জমা দিন</span><ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}