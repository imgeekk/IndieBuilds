import { getSession } from "@/lib/session";
import { getLaunchExists, toggleVote } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: launchId } = await params;

  const launch = await getLaunchExists(launchId);
  if (!launch) {
    return NextResponse.json({ error: "Launch not found" }, { status: 404 });
  }

  const result = await toggleVote(launchId, session.user.id);
  return NextResponse.json(result);
}