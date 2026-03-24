"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import divisionsData from "@/app/data/divisions.json";
import districtsData from "@/app/data/districts.json";
import upazilasData from "@/app/data/upazilas.json";
import unionsData from "@/app/data/unions.json";

interface Division { id: string; bn_name: string; }
interface District  { id: string; division_id: string; bn_name: string; }
interface Upazila   { id: string; district_id: string; bn_name: string; }
interface Union     { id: string; upazilla_id: string; bn_name: string; }

const allDivisions = divisionsData as Division[];
const allDistricts = districtsData as District[];
const allUpazilas  = upazilasData  as Upazila[];
const allUnions    = unionsData    as Union[];

interface SearchBarProps {
  onSearch?: (filters: {
    divisionId?: string;
    districtId?: string;
    upazilaId?: string;
    unionId?: string;
    gram?: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila,  setUpazila]  = useState("");
  const [union,    setUnion]    = useState("");
  const [gram,     setGram]     = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas,  setUpazilas]  = useState<Upazila[]>([]);
  const [unions,    setUnions]    = useState<Union[]>([]);

  useEffect(() => {
    if (!division) { setDistricts([]); return; }
    setDistricts(allDistricts.filter((d) => d.division_id === division));
    setDistrict(""); setUpazilas([]); setUpazila("");
    setUnions([]);   setUnion("");    setGram("");
  }, [division]);

  useEffect(() => {
    if (!district) { setUpazilas([]); return; }
    setUpazilas(allUpazilas.filter((u) => u.district_id === district));
    setUpazila(""); setUnions([]); setUnion(""); setGram("");
  }, [district]);

  useEffect(() => {
    if (!upazila) { setUnions([]); return; }
    setUnions(allUnions.filter((u) => u.upazilla_id === upazila));
    setUnion(""); setGram("");
  }, [upazila]);

  const handleSearch = () => {
    if (!district) { alert("অনুগ্রহ করে জেলা বেছে নিন"); return; }
    onSearch?.({
      divisionId: division || undefined,
      districtId: district || undefined,
      upazilaId:  upazila  || undefined,
      unionId:    union    || undefined,
      gram:       gram.trim() || undefined,
    });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const optionStyle = "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100";

  // সবগুলো ক্লাস এক লাইনে করা হয়েছে
  const selectBase = "flex-1 min-w-0 px-2.5 sm:px-3 py-3 sm:py-3.5 text-[11px] sm:text-xs outline-none bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 border-r border-gray-200 dark:border-white/[0.08] focus:ring-1 focus:ring-yellow-500/50 appearance-none cursor-pointer";

  return (
    <div
      className="w-full max-w-[95vw] sm:max-w-2xl flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-gray-200 dark:border-white/10"
      style={{ fontFamily: "var(--font-hind)" }}
    >
      <div className="flex sm:contents">
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className={selectBase + " rounded-tl-2xl sm:rounded-tl-2xl"}
        >
          <option value="" className={optionStyle}>বিভাগ</option>
          {allDivisions.map((d) => (
            <option key={d.id} value={d.id} className={optionStyle}>{d.bn_name}</option>
          ))}
        </select>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!division}
          className={selectBase + " sm:border-r rounded-tr-2xl sm:rounded-tr-none"}
        >
          <option value="" className={optionStyle}>জেলা</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id} className={optionStyle}>{d.bn_name}</option>
          ))}
        </select>
      </div>

      <div className="flex sm:contents border-t border-gray-200 dark:border-white/[0.08] sm:border-0">
        <select
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          disabled={!district}
          className={selectBase}
        >
          <option value="" className={optionStyle}>উপজেলা</option>
          {upazilas.map((u) => (
            <option key={u.id} value={u.id} className={optionStyle}>{u.bn_name}</option>
          ))}
        </select>

        <select
          value={union}
          onChange={(e) => setUnion(e.target.value)}
          disabled={!upazila}
          className={selectBase + " sm:border-r"}
        >
          <option value="" className={optionStyle}>ইউনিয়ন</option>
          {unions.map((u) => (
            <option key={u.id} value={u.id} className={optionStyle}>{u.bn_name}</option>
          ))}
        </select>
      </div>

      <div className="flex sm:contents border-t border-gray-200 dark:border-white/[0.08] sm:border-0">
        <input
          type="text"
          value={gram}
          onChange={(e) => setGram(e.target.value)}
          onKeyDown={handleKey}
          placeholder="গ্রামের নাম"
          disabled={!union}
          className="flex-1 sm:flex-[0.8] px-3 py-3 sm:py-3.5 text-[11px] sm:text-xs outline-none bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-1 focus:ring-yellow-500/50 transition-colors duration-200 border-r border-gray-200 dark:border-white/[0.08]"
        />

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-gray-900 font-bold text-[11px] sm:text-xs px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-150 whitespace-nowrap rounded-b-2xl sm:rounded-b-none sm:rounded-r-2xl"
        >
          <Search size={13} />
          <span>খুঁজুন</span>
        </button>
      </div>
    </div>
  );
}