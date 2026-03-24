"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMasjid(data: any) {
  try {
    const newMasjid = await prisma.masjid.create({
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
        approved: true, // ডিফল্টভাবে false থাকবে
      },
    });

    revalidatePath("/"); // ডাটা সেভ হওয়ার পর হোম পেজ রিফ্রেশ করার জন্য
    return { success: true, id: newMasjid.id };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "ডাটা সেভ করতে সমস্যা হয়েছে" };
  }
}


export async function getMasjids(filters: {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
  unionId?: string;
  gram?: string;
}) {
  try {
    console.log("Filters:", JSON.stringify(filters))
    const masjids = await prisma.masjid.findMany({
      where: {
        approved: true,
        ...(filters.divisionId && { divisionId: filters.divisionId }),
        ...(filters.districtId && { districtId: filters.districtId }),
        ...(filters.upazilaId && { upazilaId: filters.upazilaId }),
        ...(filters.unionId && { unionId: filters.unionId }),
       ...(filters.gram && { 
  gram: { 
    contains: filters.gram.trim(), 
    mode: 'insensitive' as const 
  } 
}),
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("Results:", masjids.length)
    return { success: true, data: masjids };
  } catch (error) {
    console.error("Fetch Error:", error)
    return { success: false, data: [] };
  }
}
// সম্প্রতি যোগ করা ৮টি মসজিদ
export async function getRecentMasjids() {
  try {
    const masjids = await prisma.masjid.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return { success: true, data: masjids };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, data: [] };
  }
}
