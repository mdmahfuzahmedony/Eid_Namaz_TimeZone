"use client";
import { useState } from "react";
import {
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MasjidCard from "@/component/MasjidCard";

export default function MyMasjidList({
  masjids,
  loading,
  onEdit,
  onDelete,
}: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = masjids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(masjids.length / itemsPerPage);

  if (loading)
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="animate-spin text-yellow-500" size={50} />
      </div>
    );
  if (masjids.length === 0)
    return (
      <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl opacity-50 italic">
        কোনো তথ্য নেই।
      </div>
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h1 className="text-2xl font-black italic mb-8 text-white">
        আমার <span className="text-yellow-500"> যোগ করা ইদ্গাহগুলা</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentItems.map((masjid: any) => (
          <div key={masjid.id} className="relative flex flex-col group">
            <MasjidCard {...masjid} />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(masjid)}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-2xl font-black text-[10px] flex justify-center items-center gap-2 shadow-lg"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(masjid.id)}
                className="p-3 bg-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-3">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-yellow-500 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === idx + 1 ? "bg-yellow-500 text-black" : "bg-white/5 text-slate-400 border border-white/10"}`}
              >
                {(idx + 1).toLocaleString("bn-BD")}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-yellow-500 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
