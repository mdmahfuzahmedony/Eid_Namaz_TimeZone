"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

export default function SearchBar({ onSearch, language }: any) {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [gram, setGram] = useState("");

  const filteredDistricts = useMemo(() =>
    division ? (districtsData as any[]).filter(d => d.division_id === division) : []
  , [division]);

  const filteredUpazilas = useMemo(() =>
    district ? (upazilasData as any[]).filter(u => u.district_id === district) : []
  , [district]);

  const filteredUnions = useMemo(() =>
    upazila ? (unionsData as any[]).filter(u => u.upazilla_id === upazila) : []
  , [upazila]);

  useEffect(() => { setDistrict(""); setUpazila(""); setUnion(""); }, [division]);
  useEffect(() => { setUpazila(""); setUnion(""); }, [district]);
  useEffect(() => { setUnion(""); }, [upazila]);

  const L = {
    division: language === "bn" ? "বিভাগ"        : "Division",
    district:  language === "bn" ? "জেলা"         : "District",
    upazila:   language === "bn" ? "উপজেলা"       : "Upazila",
    union:     language === "bn" ? "ইউনিয়ন"      : "Union",
    gramPh:    language === "bn" ? "গ্রামের নাম…" : "Village name…",
    search:    language === "bn" ? "খুঁজুন"       : "Search",
  };

  const fields = [
    { key: "division", value: division, onChange: setDivision, ph: L.division,
      options: (divisionsData as any[]).map(d => ({ id: d.id, label: language === "bn" ? d.bn_name : d.name })),
      disabled: false },
    { key: "district", value: district, onChange: setDistrict, ph: L.district,
      options: filteredDistricts.map(d => ({ id: d.id, label: language === "bn" ? d.bn_name : d.name })),
      disabled: !division },
    { key: "upazila", value: upazila, onChange: setUpazila, ph: L.upazila,
      options: filteredUpazilas.map(u => ({ id: u.id, label: language === "bn" ? u.bn_name : u.name })),
      disabled: !district },
    { key: "union", value: union, onChange: setUnion, ph: L.union,
      options: filteredUnions.map(u => ({ id: u.id, label: language === "bn" ? u.bn_name : u.name })),
      disabled: !upazila },
  ];

  // ════════════════════════════════════════════════════════════
  // স্পেস রিমুভ করার আপডেট করা লজিক
  // ════════════════════════════════════════════════════════════
  const handleSearchClick = () => {
    // গ্রামের নামের আগের ও পরের স্পেস মুছে ফেলা হবে
    // এবং মাঝখানের একাধিক স্পেসকে একটি স্পেসে রূপান্তর করা হবে
    const cleanedGram = gram.trim().replace(/\s+/g, ' '); 

    onSearch?.({ 
        divisionId: division, 
        districtId: district, 
        upazilaId: upazila, 
        unionId: union, 
        gram: cleanedGram // একদম ক্লিন ডাটা পাঠানো হচ্ছে
    });
  };

  return (
    <>
      <style>{`
        .sb * { box-sizing: border-box; }
        .sb select:focus, .sb input:focus { outline: none !important; }
        .sb { width: 100%; max-width: 900px; }

        @media (min-width: 640px) {
          .sb-wrap {
            display: flex; height: 52px; background: rgba(255,255,255,0.09);
            backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 9999px; overflow: hidden;
          }
          .sb-seg {
            display: flex; align-items: center; flex: 1; padding: 0 15px;
            border-right: 1px solid rgba(255,255,255,0.10); position: relative; min-width: 0;
          }
          .sb-seg--gram { flex: 1.3; border-right: none; }
          .sb-seg select, .sb-seg input {
            width: 100%; background: transparent; border: none; color: #fff;
            font-size: 13px; font-weight: 600; cursor: pointer; padding-right: 15px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          .sb-seg select option { background: #0f172a; color: #e2e8f0; }
          .sb-seg select.ph-color { color: rgba(255,255,255,0.4); }
          .sb-caret { position: absolute; right: 8px; color: rgba(255,255,255,0.3); pointer-events: none; }
          .sb-btn {
            display: flex; align-items: center; gap: 8px; background: #eab308; color: #111;
            font-size: 12px; font-weight: 800; text-transform: uppercase;
            padding: 0 24px; border: none; cursor: pointer; transition: all 0.2s;
          }
          .sb-btn:hover { background: #fbbf24; }
        }

        @media (max-width: 639px) {
          .sb-wrap { background: rgba(255,255,255,0.09); border-radius: 20px; overflow: hidden; }
          .sb-seg { display: flex; align-items: center; gap: 10px; padding: 0 16px; height: 46px; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .sb-seg::before { content: ''; width: 3px; height: 14px; background: #eab308; border-radius: 10px; }
          .sb-seg select, .sb-seg input { flex: 1; background: transparent; border: none; color: #fff; font-size: 13px; font-weight: 600; }
          .sb-btn { width: 100%; height: 50px; background: #eab308; color: #111; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; }
        }
      `}</style>

      <div className="sb">
        <div className="sb-wrap">
          {fields.map(f => (
            <div key={f.key} className={`sb-seg${f.disabled ? " sb-seg--off" : ""}`}>
              <select
                key={`${f.key}-${language}`}
                value={f.value}
                disabled={f.disabled}
                className={f.value === "" ? "ph-color" : ""}
                onChange={e => f.onChange(e.target.value)}
              >
                <option value="">{f.ph}</option>
                {f.options.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              {!f.disabled && <ChevronDown size={12} className="sb-caret" />}
            </div>
          ))}

          <div className="sb-seg sb-seg--gram">
            <input
              type="text"
              value={gram}
              placeholder={L.gramPh}
              onChange={e => setGram(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearchClick()}
            />
          </div>

          <button className="sb-btn" onClick={handleSearchClick}>
            <Search size={15} strokeWidth={3} />
            <span>{L.search}</span>
          </button>
        </div>
      </div>
    </>
  );
}