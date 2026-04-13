"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { X, AlertTriangle, Trash2 } from "lucide-react"; // নতুন আইকন যোগ করা হয়েছে

import { uploadImage } from "@/app/actions/uploadAction";
import AddMasjid from "@/component/addMasjid";
import { getUserMasjids, deleteMasjid } from "@/app/actions/masjidActions";
import { updateUserProfile } from "@/app/actions/users"; 

import DashboardHeader from "@/component/dashboard/DashboardHeader";
import DashboardSidebar from "@/component/dashboard/DashboardSidebar";
import MyMasjidList from "@/component/dashboard/MyMasjidList";
import ProfileSettings from "@/component/dashboard/ProfileSettings";

export default function DashboardPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("listings");
  const [myMasjids, setMyMasjids] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editMasjid, setEditMasjid] = useState<any>(null);

  // --- ডিলিট মোডাল স্টেট ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [masjidIdToDelete, setMasjidIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", image: "", password: "", newPassword: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const EID_DATE = "2026-05-27T00:00:00";

  const fetchData = async () => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      setLoadingData(true);
      const result = await getUserMasjids(userId);
      if (result.success) setMyMasjids(result.data);
      setLoadingData(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    if (session?.user) {
      setProfileData(prev => ({ ...prev, name: session.user?.name || "", image: session.user?.image || "" }));
    }
  }, [session?.user]);

  // ডিলিট বাটন ক্লিক করলে মোডাল ওপেন হবে
  const openDeleteModal = (id: string) => {
    setMasjidIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // মোডাল থেকে কনফার্ম করলে ডিলিট হবে
  const handleConfirmDelete = async () => {
    if (!masjidIdToDelete) return;
    
    setIsDeleting(true);
    const res = await deleteMasjid(masjidIdToDelete);
    if (res.success) { 
      toast.success("সফলভাবে ডিলিট হয়েছে"); 
      fetchData(); 
    } else {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setMasjidIdToDelete(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = (session?.user as any)?.id;

    if (!userId) {
        toast.error("ইউজার আইডি পাওয়া যায়নি!");
        return;
    }

    setProfileLoading(true);
    try {
      let finalImageUrl = profileData.image;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadedUrl = await uploadImage(formData);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const res = await updateUserProfile({ 
        userId: userId,
        name: profileData.name, 
        image: finalImageUrl, 
        password: profileData.password, 
        newPassword: profileData.newPassword 
      });

      if (res.success) {
        toast.success("প্রোফাইল আপডেট হয়েছে! 🚀");
        await update({ ...session, user: { ...session?.user, name: profileData.name, image: finalImageUrl } });
        setProfileData(prev => ({ ...prev, password: "", newPassword: "" }));
        setSelectedFile(null);
      } else {
        toast.error(res.error);
      }
    } catch (err) { 
      toast.error("সমস্যা হয়েছে"); 
    } finally { 
      setProfileLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-white font-sans overflow-x-hidden pb-20 relative">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <DashboardHeader session={session} eidDate={EID_DATE} />
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 min-h-[700px] bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-6 sm:p-10 border border-white/10 shadow-2xl">
            {activeTab === "listings" && (
                <MyMasjidList 
                    masjids={myMasjids} 
                    loading={loadingData} 
                    onEdit={(m: any) => { setEditMasjid(m); setActiveTab("edit"); }} 
                    onDelete={openDeleteModal} // এখানে এখন মোডাল ওপেন করার ফাংশন
                />
            )}
            
            {(activeTab === "add" || activeTab === "edit") && (
              <div className="animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black italic">{activeTab === "add" ? "নতুন তথ্য যোগ" : "তথ্য আপডেট"} করুন</h2>
                  <button onClick={() => {setActiveTab("listings"); setEditMasjid(null);}} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={18}/></button>
                </div>
                <AddMasjid editData={editMasjid} language="bn" onSuccess={() => { setEditMasjid(null); fetchData(); setActiveTab("listings"); }} />
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileSettings 
                profileData={profileData} 
                setProfileData={setProfileData} 
                onUpdate={handleProfileUpdate} 
                loading={profileLoading} 
                selectedFile={selectedFile} 
                setSelectedFile={setSelectedFile} 
              />
            )}
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          Delete Confirmation Modal (কাস্টম মোডাল)
      ════════════════════════════════════════════════════════════ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* ব্যাকড্রপ ওভারলে */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>

          {/* মোডাল কন্টেন্ট */}
          <div className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <h3 className="text-xl font-bold mb-2">আপনি কি নিশ্চিত?</h3>
            <p className="text-slate-400 text-sm mb-8">
              এই তথ্যটি ডিলিট করলে আর ফিরে পাওয়া যাবে না। আপনি কি সত্যিই এটি ডিলিট করতে চান?
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
              >
                বাতিল
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <><Trash2 size={18}/> ডিলিট করুন</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}