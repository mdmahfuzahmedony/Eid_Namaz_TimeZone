import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const divisionId = searchParams.get("divisionId");
  const districtId = searchParams.get("districtId");
  const upazilaId = searchParams.get("upazilaId");
  const union = searchParams.get("union"); // ইউনিয়ন আইডি অথবা পৌরসভার নাম
  const gram = searchParams.get("gram");
  const isCityMode = searchParams.get("isCityMode") === "true"; // স্ট্রিং থেকে বুলিয়ান

  try {
    const masjids = await prisma.masjid.findMany({
      where: {
        isPublished: true,
        ...(divisionId && { divisionId }),
        ...(districtId && { districtId }),
        ...(upazilaId && { upazilaId }),
        
        // ════════════════════════════════════════════════════════════
        // শহর না গ্রাম তার ওপর ভিত্তি করে সার্চ লজিক
        // ════════════════════════════════════════════════════════════
        ...(union && (isCityMode ? 
          { unionName: { contains: union.trim(), mode: "insensitive" } } : 
          { unionId: union }
        )),

        ...(gram && {
          gram: { contains: gram.trim(), mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({ success: true, data: masjids });
  } catch (error) {
    console.error("Search fetch error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}