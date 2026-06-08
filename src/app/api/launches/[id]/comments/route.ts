import { getSession } from "@/lib/session";
import { getComments, createComment } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";
import { createCommentSchema } from "@/lib/validations";

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

  const parsed = createCommentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { body, isRoast } = parsed.data;

  const comment = await createComment({ body: body.trim(),
    isRoast: isRoast ?? false,
    userId: session.user.id,
    launchId,
  });

  return NextResponse.json(comment, { status: 201 });
}
