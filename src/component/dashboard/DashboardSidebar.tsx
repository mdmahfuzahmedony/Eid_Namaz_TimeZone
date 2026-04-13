"use client";
import { useState } from "react";
import { LayoutDashboard, PlusSquare, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ConfirmModal from "../ConfirmModal"; 

export default function DashboardSidebar({ activeTab, setActiveTab }: any) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: "listings", label: "আমার ঈদগাহ গুলা", icon: LayoutDashboard },
    { id: "add", label: "নতুন মসজিদ যোগ", icon: PlusSquare },
    { id: "profile", label: "প্রোফাইল সেটিংস", icon: Settings }
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <>
      <aside className="w-full lg:w-[300px] shrink-0">
        <div className="bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 flex flex-col gap-3 sticky top-10 shadow-2xl">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id 
                ? "bg-yellow-500 text-black shadow-xl scale-105" 
                : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
          
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="mt-4 flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={18} /> লগআউট
          </button>
        </div>
      </aside>



     
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