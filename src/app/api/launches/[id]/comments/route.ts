import { getSession } from "@/lib/session";
import { getComments, createComment } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: launchId } = await params;
  const comments = await getComments(launchId);
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

  const comment = await createComment({
    body: body.trim(),
    isRoast: isRoast ?? false,
    userId: session.user.id,
    launchId,
  });

  return NextResponse.json(comment, { status: 201 });
}
