import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

const {id: launchId} = await params;
  const userId = session.user.id;

  // check launch exists
  const launch = await prisma.launch.findUnique({ where: { id: launchId } });
  if (!launch) {
    return NextResponse.json({ error: "Launch not found" }, { status: 404 });
  }

  // toggle vote
  const existing = await prisma.vote.findUnique({
    where: { userId_launchId: { userId, launchId } },
  });

  if (existing) {
    await prisma.vote.delete({
      where: { userId_launchId: { userId, launchId } },
    });
    return NextResponse.json({ voted: false });
  } else {
    await prisma.vote.create({
      data: { userId, launchId },
    });
    return NextResponse.json({ voted: true });
  }
}