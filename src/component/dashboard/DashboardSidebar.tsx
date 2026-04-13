"use client";
import { useState } from "react";
import { LayoutDashboard, PlusSquare, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ConfirmModal from "../ConfirmModal"; 

export default function DashboardSidebar({ activeTab, setActiveTab }: any) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: "listings", label: "আমার ঈদগাহ গুলা", icon: LayoutDashboard },
    { id: "add", label: "নতুন তথ্য যোগ", icon: PlusSquare },
    { id: "profile", label: "প্রোফাইল সেটিংস", icon: Settings }
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <>
      <aside className="w-full lg:w-[260px] shrink-0">
        <div className="bg-slate-900/60 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/5 flex flex-col gap-2.5 sticky top-10 shadow-xl">
          
          {/* মেনু আইটেমগুলো */}
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === item.id 
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10 scale-[1.02]" 
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={16} /> 
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* ডিভাইডার */}
          <div className="h-px bg-white/5 my-2 mx-2"></div>

          {/* লগআউট বাটন */}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/5 text-red-500 text-[13px] font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={16} /> 
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* কনফার্মেশন মোডাল */}
      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="লগআউট করতে চান?"
        description="আপনি কি নিশ্চিত যে আপনি আপনার প্রোফাইল থেকে বের হয়ে যেতে চান?"
        confirmText="হ্যাঁ, বিদায়"
        Icon={LogOut} 
        variant="danger"
      />
    </>
  );
}