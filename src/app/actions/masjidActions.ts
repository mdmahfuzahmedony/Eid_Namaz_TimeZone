"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ১. নতুন মসজিদ তৈরি করা (ডুপ্লিকেট চেক সহ)
export async function createMasjid(data: any) {
  if (!data.userId) {
    return { success: false, error: "ইউজার আইডি পাওয়া যায়নি। দয়া করে আবার লগইন করুন।" };
  }

  try {
    // 🔍 ডুপ্লিকেট চেক: একই ইউনিয়নের ভেতর একই নামের মসজিদ আছে কি না?
    const existingMasjid = await prisma.masjid.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' }, // বড়-ছোট হাতের অক্ষর সমস্যা করবে না
        unionId: data.unionId, // শুধুমাত্র একই ইউনিয়নের ভেতর চেক করবে
      },
      include: {
        user: {
          select: { name: true, image: true } // যে ইউজার আগে অ্যাড করেছে তার নাম ও ছবি
        }
      }
    });

    // যদি মসজিদ অলরেডি থাকে, তবে ইউজারের তথ্যসহ রিটার্ন করবে
    if (existingMasjid) {
      return { 
        success: false, 
        isDuplicate: true, 
        owner: {
          name: existingMasjid.user.name,
          image: existingMasjid.user.image
        }
      };
    }

    // ডুপ্লিকেট না থাকলে নতুন মসজিদ তৈরি হবে
    const newMasjid = await prisma.masjid.create({
      data: {
        name: data.name,
        type: data.type,
        imamName: data.imamName || null,
        mapLink: data.mapLink || null,
        imageUrl: data.imageUrl || null,
        jamaat1: data.jamaat1 || null,
        jamaat2: data.jamaat2 || null,
        divisionId: data.divisionId,
        districtId: data.districtId,
        upazilaId: data.upazilaId,
        unionId: data.unionId,
        gram: data.gram,
        divisionName: data.divisionName,
        districtName: data.districtName,
        upazilaName: data.upazilaName,
        unionName: data.unionName,
        isPublished: data.isPublished, 
        userId: data.userId, 
        approved: true, 
      },
    });

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, id: newMasjid.id };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "ডাটা সেভ করতে সমস্যা হয়েছে" };
  }
}

// ২. ইউজারের নিজস্ব সব ডাটা
export async function getUserMasjids(userId: string) {
  try {
    if (!userId) return { success: false, data: [] };
    const masjids = await prisma.masjid.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: masjids };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৩. ডিলিট করা
export async function deleteMasjid(id: string) {
  try {
    await prisma.masjid.delete({ where: { id } });
    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "ডিলিট করা যায়নি" };
  }
}

// ৪. মেইন পেজ/সার্চ
export async function getMasjids(filters: any) {
  try {
    const masjids = await prisma.masjid.findMany({
      where: {
        approved: true,
        isPublished: true, 
        ...(filters.divisionId && { divisionId: filters.divisionId }),
        ...(filters.districtId && { districtId: filters.districtId }),
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: masjids };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৫. হোম পেজের রিসেন্ট ডাটা
export async function getRecentMasjids() {
  try {
    const masjids = await prisma.masjid.findMany({
      where: { approved: true, isPublished: true },
      orderBy: { createdAt: "desc" },
     
    });
    return { success: true, data: masjids };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ৬. আপডেট করা
export async function updateMasjid(id: string, data: any) {
  try {
    await prisma.masjid.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        imamName: data.imamName,
        mapLink: data.mapLink,
        imageUrl: data.imageUrl,
        jamaat1: data.jamaat1,
        jamaat2: data.jamaat2,
        divisionId: data.divisionId,
        districtId: data.districtId,
        upazilaId: data.upazilaId,
        unionId: data.unionId,
        gram: data.gram,
        divisionName: data.divisionName,
        districtName: data.districtName,
        upazilaName: data.upazilaName,
        unionName: data.unionName,
        isPublished: data.isPublished,
      },
    });
    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "আপডেট করা যায়নি" };
  }
}