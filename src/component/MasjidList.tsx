"use client";

import { useEffect, useState } from "react";
import MasjidCard from "@/component/MasjidCard";

export default function MasjidList({ searchFilters }: { searchFilters: any }) {
  const [masjids, setMasjids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isSearching = !!searchFilters;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = searchFilters 
          ? await fetch(`/api/masjids/search?${new URLSearchParams(searchFilters).toString()}`)
          : await fetch("/api/masjids/recent");
        const json = await res.json();
        setMasjids(json.data ?? []);
      } catch (err) {
        setMasjids([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [JSON.stringify(searchFilters)]);

  return (
    // এখানে কোনো Hardcoded ব্যাকগ্রাউন্ড (যেমন bg-red বা bg-black) নেই
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      
      {/* হেডিং এরিয়া */}
      <div className="mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-yellow-400 rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isSearching ? "অনুসন্ধানের ফলাফল" : "সম্প্রতি যোগ করা মসজিদ"}
          </h2>
        </div>
        {!loading && (
          <p className="text-sm opacity-60 ml-5 font-medium">
            {masjids.length === 0
              ? "কোনো মসজিদ পাওয়া যায়নি"
              : <><span className="text-yellow-500">{masjids.length}টি</span> মসজিদ পাওয়া গেছে</>}
          </p>
        )}
      </div>

      {/* কার্ড গ্রিড */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {masjids.map((m) => (
            <MasjidCard key={m.id} {...m} />
          ))}
        </div>
      )}
    </section>
  );
}