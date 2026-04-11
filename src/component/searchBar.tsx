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

  return (
    <>
      <style>{`
        /* reset browser blue outline globally for this component */
        .sb * { box-sizing: border-box; }
        .sb select:focus,
        .sb input:focus { outline: none !important; box-shadow: none !important; }
        .sb select:-moz-focusring { color: transparent; text-shadow: 0 0 0 #fff; }

        /* ── root ── */
        .sb { width: 100%; max-width: 900px; }

        /* ══════════════════════════════
           DESKTOP  (≥640px)  pill shape
        ══════════════════════════════ */
        @media (min-width: 640px) {
          .sb-wrap {
            display: flex;
            align-items: stretch;
            height: 58px;
            background: rgba(255,255,255,0.09);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 9999px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.13);
            overflow: hidden;
          }

          .sb-seg {
            display: flex;
            align-items: center;
            flex: 1;
            padding: 0 18px;
            border-right: 1px solid rgba(255,255,255,0.10);
            position: relative;
            min-width: 0;
            transition: background 0.18s;
          }
          .sb-seg:not(.sb-seg--off):hover { background: rgba(255,255,255,0.07); }
          .sb-seg--gram { flex: 1.3; border-right: none; }

          .sb-seg select,
          .sb-seg input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            color: #fff;
            font-size: 13.5px;
            font-weight: 600;
            cursor: pointer;
            padding-right: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .sb-seg select option         { background: #0f172a; color: #e2e8f0; }
          .sb-seg select.ph-color       { color: rgba(255,255,255,0.45); }
          .sb-seg select:disabled       { opacity: 0.3; cursor: not-allowed; }
          .sb-seg input::placeholder    { color: rgba(255,255,255,0.4); font-weight: 400; }

          .sb-caret {
            position: absolute;
            right: 8px;
            color: rgba(255,255,255,0.3);
            pointer-events: none;
          }
          .sb-seg:not(.sb-seg--off):hover .sb-caret { color: rgba(253,224,71,0.7); }

          .sb-btn {
            display: flex; align-items: center; gap: 8px;
            background: #eab308; color: #111;
            font-size: 13px; font-weight: 800; letter-spacing: 0.04em;
            text-transform: uppercase;
            padding: 0 28px; border: none; cursor: pointer;
            border-radius: 0 9999px 9999px 0;
            transition: background 0.18s, transform 0.12s;
            white-space: nowrap; flex-shrink: 0;
          }
          .sb-btn:hover  { background: #fbbf24; }
          .sb-btn:active { transform: scale(0.97); }
        }

        /* ══════════════════════════════
           MOBILE  (<640px)  card style
        ══════════════════════════════ */
        @media (max-width: 639px) {
          .sb-wrap {
            background: rgba(255,255,255,0.09);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 20px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.45);
            overflow: hidden;
          }

          .sb-seg {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 16px;
            height: 48px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            position: relative;
          }
          /* icon left indicator */
          .sb-seg::before {
            content: '';
            width: 3px; height: 18px;
            border-radius: 99px;
            background: rgba(234,179,8,0.5);
            flex-shrink: 0;
          }
          .sb-seg--off::before { background: rgba(255,255,255,0.1); }

          .sb-seg select,
          .sb-seg input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            padding-right: 24px;
          }
          .sb-seg select option         { background: #0f172a; color: #e2e8f0; }
          .sb-seg select.ph-color       { color: rgba(255,255,255,0.42); }
          .sb-seg select:disabled       { opacity: 0.3; cursor: not-allowed; }
          .sb-seg input::placeholder    { color: rgba(255,255,255,0.38); font-weight: 400; }

          .sb-caret {
            position: absolute;
            right: 14px;
            color: rgba(255,255,255,0.28);
            pointer-events: none;
          }

          .sb-btn {
            display: flex; align-items: center; justify-content: center; gap-8px;
            width: 100%; height: 52px;
            background: #eab308; color: #111;
            font-size: 14px; font-weight: 800; letter-spacing: 0.04em;
            text-transform: uppercase;
            border: none; cursor: pointer; gap: 8px;
            transition: background 0.18s;
          }
          .sb-btn:hover  { background: #fbbf24; }
          .sb-btn:active { background: #ca8a04; }
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
              {!f.disabled && <ChevronDown size={13} className="sb-caret" />}
            </div>
          ))}

          {/* Gram */}
          <div className="sb-seg sb-seg--gram">
            <input
              type="text"
              value={gram}
              placeholder={L.gramPh}
              onChange={e => setGram(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch?.({ division, district, upazila, union, gram })}
            />
          </div>

          <button
            className="sb-btn"
            onClick={() => onSearch?.({ division, district, upazila, union, gram })}
          >
            <Search size={16} strokeWidth={2.8} />
            <span>{L.search}</span>
          </button>

        </div>
      </div>
    </>
  );
}
