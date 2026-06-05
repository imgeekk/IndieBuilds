import { getSession } from "@/lib/session";
import { getCurrentWeekId } from "@/lib/week";
import { getExistingUserLaunch, createLaunch, touchUserLastShipped } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";
import { FetchOgImage } from "@/lib/fetchOg";

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

  const existing = await getExistingUserLaunch(session.user.id, weekId);
  if (existing) {
    return NextResponse.json({ error: "You already submitted a launch this week." }, { status: 409 });
  }

  const ogImage = await FetchOgImage(url);

  const launch = await createLaunch({
    name,
    tagline,
    url,
    description: description ?? undefined,
    ogImage: ogImage ?? undefined,
    stack: stack ?? [],
    userId: session.user.id,
    weekId,
  });

  await touchUserLastShipped(session.user.id);

  return NextResponse.json(launch, { status: 201 });
}