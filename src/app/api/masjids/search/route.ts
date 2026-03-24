import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// api/masjids/search/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // query parameter থেকে মানগুলো নিন
  const divisionId = searchParams.get("divisionId");
  const districtId = searchParams.get("districtId");
  const upazilaId = searchParams.get("upazilaId");
  const unionId = searchParams.get("unionId");
  const gram = searchParams.get("gram");

  try {
    console.log("Searching with:", { divisionId, districtId, upazilaId, unionId, gram });
    const masjids = await prisma.masjid.findMany({
      where: {
        // approved: true, // যদি চেক করতে চান তবে এটি আপাতত কমেন্ট করে দেখতে পারেন
        ...(divisionId && { divisionId: divisionId }),
        ...(districtId && { districtId: districtId }),
        ...(upazilaId && { upazilaId: upazilaId }),
        ...(unionId && { unionId: unionId }),
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