import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> },
) {
  const fid = params.fid;

  const bookmark = await prisma.bookmarks.findMany({
    where: {
      fid,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return NextResponse.json(
    {
      message: "OK",
      bookmarks: bookmark,
    },
    { status: 200 },
  );
}
