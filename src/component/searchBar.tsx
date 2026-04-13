"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, MapPin, Building2, Home } from "lucide-react";
import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

export default function SearchBar({ onSearch, language }: any) {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState(""); // এখানে ইউনিয়ন আইডি অথবা পৌরসভার নাম থাকবে
  const [gram, setGram] = useState("");
  const [isCityMode, setIsCityMode] = useState(false); // শহর না গ্রাম মোড

  const filteredDistricts = useMemo(() =>
    division ? (districtsData as any[]).filter(d => d.division_id === division) : []
  , [division]);

  const filteredUpazilas = useMemo(() =>
    district ? (upazilasData as any[]).filter(u => u.district_id === district) : []
  , [district]);

  const filteredUnions = useMemo(() =>
    upazila ? (unionsData as any[]).filter(u => u.upazilla_id === upazila) : []
  , [upazila]);

  // ডিপেন্ডেন্সি অনুযায়ী স্টেট রিসেট
  useEffect(() => { setDistrict(""); setUpazila(""); setUnion(""); }, [division]);
  useEffect(() => { setUpazila(""); setUnion(""); }, [district]);
  useEffect(() => { setUnion(""); }, [upazila, isCityMode]);

  const handleSearchClick = () => {
    // স্পেস ক্লিন করার লজিক
    const clean = (str: string) => str.trim().replace(/\s+/g, ' ');
    
    onSearch?.({ 
        divisionId: division, 
        districtId: district, 
        upazilaId: upazila, 
        isCityMode: isCityMode, // এপিআই-কে জানাবে এটা কি শহর না গ্রাম
        union: clean(union),    // গ্রাম হলে আইডি যাবে, শহর হলে নাম যাবে
        gram: clean(gram) 
    });
  };

  return (
    <>
      <style>{`
        .sb * { box-sizing: border-box; }
        .sb select:focus, .sb input:focus { outline: none !important; }
        .sb { width: 100%; max-width: 1000px; padding: 0 10px; }

        /* মোড সুইচ ডিজাইন */
        .mode-toggle-container {
          display: flex; justify-content: center; margin-bottom: 12px; gap: 8px;
        }
        .mode-btn {
          display: flex; align-items: center; gap: 6px; padding: 6px 14px;
          border-radius: 12px; font-size: 11px; font-weight: 800; border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s; cursor: pointer; background: rgba(255,255,255,0.05); color: #64748b;
        }
        .mode-btn.active { background: #eab308; color: #000; border-color: #eab308; shadow: 0 4px 12px rgba(234,179,8,0.2); }

        @media (min-width: 640px) {
          .sb-wrap {
            display: flex; height: 52px; background: rgba(255,255,255,0.09);
            backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 9999px; overflow: hidden;
          }
          .sb-seg {
            display: flex; align-items: center; flex: 1; padding: 0 12px;
            border-right: 1px solid rgba(255,255,255,0.10); position: relative; min-width: 0;
          }
          .sb-seg:last-child { border-right: none; }
          .sb-seg select, .sb-seg input {
            width: 100%; background: transparent; border: none; color: #fff;
            font-size: 12.5px; font-weight: 600; cursor: pointer; padding-right: 12px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          .sb-seg select option { background: #0f172a; color: #e2e8f0; }
          .sb-seg select.ph-color { color: rgba(255,255,255,0.4); }
          .sb-caret { position: absolute; right: 6px; color: rgba(255,255,255,0.3); pointer-events: none; }
          .sb-btn {
            display: flex; align-items: center; gap: 8px; background: #eab308; color: #111;
            font-size: 12px; font-weight: 800; text-transform: uppercase;
            padding: 0 22px; border: none; cursor: pointer; transition: all 0.2s;
          }
          .sb-btn:hover { background: #fbbf24; }
        }

        @media (max-width: 639px) {
          .sb-wrap { background: rgba(255,255,255,0.09); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
          .sb-seg { display: flex; align-items: center; gap: 10px; padding: 0 16px; height: 46px; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .sb-seg select, .sb-seg input { flex: 1; background: transparent; border: none; color: #fff; font-size: 13px; font-weight: 600; }
          .sb-btn { width: 100%; height: 50px; background: #eab308; color: #111; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; }
        }
      `}</style>

      <div className="sb">
        
        {/* গ্রাম/শহর মোড সুইচ বাটন */}
        <div className="mode-toggle-container">
          <button 
            onClick={() => setIsCityMode(false)} 
            className={`mode-btn ${!isCityMode ? 'active' : ''}`}
          >
            <Home size={13} /> গ্রাম / ইউনিয়ন
          </button>
          <button 
            onClick={() => setIsCityMode(true)} 
            className={`mode-btn ${isCityMode ? 'active' : ''}`}
          >
            <Building2 size={13} /> শহর / পৌরসভা
          </button>
        </div>

        <div className="sb-wrap">
          
          {/* বিভাগ */}
          <div className="sb-seg">
            <select value={division} onChange={e => setDivision(e.target.value)} className={division === "" ? "ph-color" : ""}>
              <option value="">বিভাগ</option>
              {divisionsData.map((d: any) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
            </select>
            <ChevronDown size={12} className="sb-caret" />
          </div>

          {/* জেলা */}
          <div className="sb-seg">
            <select value={district} onChange={e => setDistrict(e.target.value)} disabled={!division} className={district === "" ? "ph-color" : ""}>
              <option value="">জেলা</option>
              {filteredDistricts.map((d: any) => <option key={d.id} value={d.id}>{d.bn_name}</option>)}
            </select>
            <ChevronDown size={12} className="sb-caret" />
          </div>

          {/* উপজেলা */}
          <div className="sb-seg">
            <select value={upazila} onChange={e => setUpazila(e.target.value)} disabled={!district} className={upazila === "" ? "ph-color" : ""}>
              <option value="">উপজেলা</option>
              {filteredUpazilas.map((u: any) => <option key={u.id} value={u.id}>{u.bn_name}</option>)}
            </select>
            <ChevronDown size={12} className="sb-caret" />
          </div>

          {/* ইউনিয়ন অথবা পৌরসভার ডাইনামিক ফিল্ড */}
          <div className="sb-seg">
            {isCityMode ? (
              <input 
                type="text"
                placeholder="পৌরসভার নাম..."
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                className="w-full placeholder:text-slate-600"
              />
            ) : (
              <select 
                value={union} 
                onChange={(e) => setUnion(e.target.value)}
                disabled={!upazila}
                className={union === "" ? "ph-color" : ""}
              >
                <option value="">ইউনিয়ন</option>
                {filteredUnions.map(u => (
                  <option key={u.id} value={u.id}>{u.bn_name}</option>
                ))}
              </select>
            )}
            {!isCityMode && <ChevronDown size={12} className="sb-caret" />}
          </div>

          {/* গ্রাম অথবা ওয়ার্ড/এলাকা */}
          <div className="sb-seg">
            <input
              type="text"
              value={gram}
              placeholder={isCityMode ? "ওয়ার্ড / এলাকা..." : "গ্রামের নাম…"}
              onChange={e => setGram(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearchClick()}
              className="placeholder:text-slate-600"
            />
          </div>

          {/* সার্চ বাটন */}
          <button className="sb-btn" onClick={handleSearchClick}>
            <Search size={15} strokeWidth={3} />
            <span className="hidden sm:inline">খুঁজুন</span>
          </button>

        </div>
      </div>
    </>
  );
}