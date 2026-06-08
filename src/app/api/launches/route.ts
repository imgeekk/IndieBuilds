import { getSession } from "@/lib/session";
import { getCurrentWeekId } from "@/lib/week";
import {
  getExistingUserLaunch,
  createLaunch,
  touchUserLastShipped,
  getWeekLaunches,
} from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";
import { FetchOgImage } from "@/lib/fetchOg";
import { createLaunchSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createLaunchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { name, tagline, url, description, stack } = parsed.data;

  const weekId = getCurrentWeekId();

  const existing = await getExistingUserLaunch(session.user.id, weekId);
  if (existing) {
    return NextResponse.json(
      { error: "You already submitted a launch this week." },
      { status: 409 },
    );
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

export async function GET(req: NextRequest) {
  const weekId = req.nextUrl.searchParams.get("weekId") || getCurrentWeekId();

  if (!weekId) {
    return NextResponse.json({ error: "weekId is required" }, { status: 400 });
  }

  const session = await getSession();
  const launches = await getWeekLaunches(weekId, session?.user.id);

  return NextResponse.json(launches);
}
