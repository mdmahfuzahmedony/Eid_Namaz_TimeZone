"use client";

import { useEffect, useState } from "react";
import MasjidCard from "@/component/MasjidCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MasjidListProps {
  searchFilters: any;
}

export default function MasjidList({ searchFilters }: MasjidListProps) {
  const [masjids, setMasjids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ১. প্যাজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // প্রতি পেজে সর্বোচ্চ ৮টি কার্ড দেখাবে

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCurrentPage(1); 
      try {
        let res = searchFilters 
          ? await fetch(`/api/masjids/search?${new URLSearchParams(searchFilters).toString()}`)
          : await fetch("/api/masjids/recent", { cache: 'no-store' });
        
        const json = await res.json();
        
        if (json.success && json.data) {
          const publishedData = json.data.filter((m: any) => m.isPublished === true);
          setMasjids(publishedData);
        } else {
          setMasjids([]);
        }
      } catch (err) {
        setMasjids([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [JSON.stringify(searchFilters)]);

  // ২. প্যাজিনেশন ক্যালকুলেশন লজিক
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // currentItems এ শুধুমাত্র ৮টি ডাটা থাকবে
  const currentItems = masjids.slice(indexOfFirstItem, indexOfLastItem);
  
  // মোট কয়টি পেজ হবে তা বের করা
  const totalPages = Math.ceil(masjids.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // পেজ বদলালে স্ক্রিন একটু উপরে চলে যাবে
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      
      {/* হেডিং */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-4 text-slate-100">
          <div className="w-2 h-10 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/20"></div>
          <h2 className="text-2xl sm:text-3xl font-black italic">
            {searchFilters ? "অনুসন্ধানের ফলাফল" : "সম্প্রতি যোগ করা মসজিদসমূহ"}
          </h2>
        </div>
        {!loading && masjids.length > 0 && (
          <p className="text-sm text-slate-400 ml-6 font-medium">
            মোট <span className="text-yellow-500 font-bold">{masjids.length.toLocaleString('bn-BD')}</span> টি মসজিদ পাওয়া গেছে
          </p>
        )}
      </div>

      {/* লোডিং স্কেলিটন */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-[2rem] bg-slate-900/50 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* কার্ড গ্রিড - এখানে currentItems (৮টি) ম্যাপ করা হচ্ছে */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.length > 0 ? (
              currentItems.map((m) => (
                <MasjidCard key={m.id} {...m} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-800 bg-slate-900/20">
                <p className="text-slate-500 font-bold italic opacity-60">দুঃখিত, কোনো মসজিদ পাওয়া যায়নি</p>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════════
              ৩. প্যাজিনেশন বাটন এরিয়া (এটিই আপনি খুঁজছিলেন)
              এটি তখনই দেখা যাবে যখন totalPages ১ এর বেশি হবে (অর্থাৎ ডাটা ৮টির বেশি)
          ════════════════════════════════════════════════════════════ */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-3">
              {/* প্রিভিয়াস বাটন */}
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-yellow-500/50 disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronLeft size={24} className="text-yellow-500" />
              </button>

              {/* পেজ নম্বর বাটনগুলো */}
              <div className="flex gap-2.5">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all border ${
                      currentPage === idx + 1 
                      ? "bg-yellow-500 text-black border-yellow-500 shadow-xl shadow-yellow-500/20" 
                      : "bg-slate-900 text-slate-400 border-white/10 hover:border-yellow-500/50"
                    }`}
                  >
                    {(idx + 1).toLocaleString('bn-BD')}
                  </button>
                ))}
              </div>

              {/* নেক্সট বাটন */}
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-yellow-500/50 disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronRight size={24} className="text-yellow-500" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}