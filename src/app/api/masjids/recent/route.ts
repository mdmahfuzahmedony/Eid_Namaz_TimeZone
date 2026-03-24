import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const masjids = await prisma.masjid.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return NextResponse.json({ success: true, data: masjids });
  } catch (error) {
    console.error("Recent fetch error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}