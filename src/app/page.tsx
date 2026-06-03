import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getCurrentWeekId } from "../lib/week";
import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import WeekHeader from "@/components/WeekHeader";
import Link from "next/link";
import { addWeeks, startOfWeek, format } from "date-fns";

export const revalidate = 60; // revalidate every 60s

export default async function HomePage() {
  const weekId = getCurrentWeekId();
  const session = await getSession();

  const launches = await prisma.launch.findMany({
    where: { weekId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      votes: session?.user
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
    orderBy: { votes: { _count: "desc" } },
  });

  // compute prev week id
  const now = new Date();
  const thisMonday = startOfWeek(now, { weekStartsOn: 1 });
  const lastMonday = addWeeks(thisMonday, -1);
  const prevWeekId = `${lastMonday.getFullYear()}-W${format(lastMonday, "ww")}`;

  const mapped = launches.map((l) => ({
    ...l,
    userHasVoted: session?.user ? l.votes.length > 0 : false,
  }));

  return (
    <div className="min-h-screen bg-[#EEF0E8] font-[inter-regular]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">

        <WeekHeader
          weekId={weekId}
          prevWeekId={prevWeekId}
          nextWeekId={null}
          launchCount={launches.length}
        />

        {mapped.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-4xl mb-4">🏗️</p>
            <p className="text-lg font-[inter-medium] text-zinc-700">Nothing shipped yet this week</p>
            <p className="text-sm mt-1">Be the first builder to launch something</p>
            <Link
              href="/submit"
              className="inline-block mt-4 bg-orange-500 hover:bg-orange-400 text-black text-sm font-[inter-medium] px-5 py-2 rounded-sm transition-colors"
            >
              Submit your launch
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mapped.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}