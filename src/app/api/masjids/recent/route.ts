// src/app/api/masjids/recent/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const masjids = await prisma.masjid.findMany({
      where: {
        isPublished: true,
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      // ❌ এখানে যদি take: 8 থাকে তবে তা ডিলিট করে দিন
    });

    return NextResponse.json({ success: true, data: masjids });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}