import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getCurrentWeekId } from "../../../lib/week";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, tagline, url, description, stack } = body;

  if (!name || !tagline || !url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const weekId = getCurrentWeekId();

  // check if user already launched this week
  const existing = await prisma.launch.findUnique({
    where: { userId_weekId: { userId: session.user.id, weekId } },
  });

  if (existing) {
    return NextResponse.json({ error: "You already submitted a launch this week." }, { status: 409 });
  }

  const launch = await prisma.launch.create({
    data: {
      name,
      tagline,
      url,
      description,
      stack: stack ?? [],
      userId: session.user.id,
      weekId,
    },
  });

  // update user streak
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastShippedAt: new Date() },
  });

  return NextResponse.json(launch, { status: 201 });
}