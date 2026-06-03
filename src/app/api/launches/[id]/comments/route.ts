import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id: launchId } = await params;
  const comments = await prisma.comment.findMany({
    where: { launchId: launchId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id: launchId } = await params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body, isRoast } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json(
      { error: "Comment cannot be empty" },
      { status: 400 },
    );
  }

  if (body.length > 500) {
    return NextResponse.json({ error: "Max 500 characters" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: body.trim(),
      isRoast: isRoast ?? false,
      userId: session.user.id,
      launchId: launchId,
    },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
