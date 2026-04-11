"use client";
import { X, AlertTriangle, LucideIcon } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  Icon?: LucideIcon;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "বাদ দিন",
  Icon = AlertTriangle,
  variant = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl text-center flex flex-col items-center gap-6">
        
        {/* ক্লোজ বাটন */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* আইকন সেকশন */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center border ${
          variant === "danger" ? "bg-red-500/10 border-red-500/20" : "bg-yellow-500/10 border-yellow-500/20"
        }`}>
          <Icon size={40} className={variant === "danger" ? "text-red-500 animate-bounce" : "text-yellow-500 animate-pulse"} />
        </div>

        {/* টেক্সট এরিয়া */}
        <div className="space-y-2">
          <h3 className="text-white text-xl font-black">{title}</h3>
          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* বাটন এরিয়া */}
        <div className="flex w-full gap-3 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              variant === "danger" 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
              : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}