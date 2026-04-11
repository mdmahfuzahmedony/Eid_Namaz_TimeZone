"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { X } from "lucide-react";

import { uploadImage } from "@/app/actions/uploadAction";
import AddMasjid from "@/component/addMasjid";
import { getUserMasjids, deleteMasjid } from "@/app/actions/masjidActions";
import { updateUserProfile } from "@/app/actions/users"; 

// নতুন কম্পোনেন্টগুলো ইমপোর্ট করো
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

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", image: "", password: "", newPassword: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const EID_DATE = "2026-05-27T00:00:00";

  const fetchData = async () => {
    if (session?.user?.id) {
      setLoadingData(true);
      const result = await getUserMasjids(session.user.id as string);
      if (result.success) setMyMasjids(result.data);
      setLoadingData(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    if (session?.user) {
      setProfileData(prev => ({ ...prev, name: session.user?.name || "", image: session.user?.image || "" }));
    }
  }, [session?.user?.id]);

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) {
      const res = await deleteMasjid(id);
      if (res.success) { toast.success("সফলভাবে ডিলিট হয়েছে"); fetchData(); }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      let finalImageUrl = profileData.image;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadedUrl = await uploadImage(formData);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }
      const res = await updateUserProfile({ userId: session?.user?.id, name: profileData.name, image: finalImageUrl, password: profileData.password, newPassword: profileData.newPassword });
      if (res.success) {
        toast.success("প্রোফাইল আপডেট হয়েছে! 🚀");
        await update({ ...session, user: { ...session?.user, name: profileData.name, image: finalImageUrl } });
        setProfileData(prev => ({ ...prev, password: "", newPassword: "" }));
        setSelectedFile(null);
      } else toast.error(res.error);
    } catch (err) { toast.error("সমস্যা হয়েছে"); }
    finally { setProfileLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-white font-sans overflow-x-hidden pb-20">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        
        <DashboardHeader session={session} eidDate={EID_DATE} />

        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 min-h-[700px] bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-6 sm:p-10 border border-white/10 shadow-2xl">
            {activeTab === "listings" && <MyMasjidList masjids={myMasjids} loading={loadingData} onEdit={(m: any) => { setEditMasjid(m); setActiveTab("edit"); }} onDelete={handleDelete} />}
            
            {(activeTab === "add" || activeTab === "edit") && (
              <div className="animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black italic">{activeTab === "add" ? "নতুন তথ্য যোগ" : "তথ্য আপডেট"} করুন</h2>
                  <button onClick={() => {setActiveTab("listings"); setEditMasjid(null);}} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={18}/></button>
                </div>
                <AddMasjid editData={editMasjid} language="bn" onSuccess={() => { setEditMasjid(null); fetchData(); setActiveTab("listings"); }} />
              </div>
            )}

            {activeTab === "profile" && <ProfileSettings profileData={profileData} setProfileData={setProfileData} onUpdate={handleProfileUpdate} loading={profileLoading} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
          </main>
        </div>
      </div>
    </div>
  );
}