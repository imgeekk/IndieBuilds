import { getSession } from "@/lib/session";
import { getCurrentWeekId } from "@/lib/week";
import { getWeekLaunches } from "@/lib/services";
import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import WeekHeader from "@/components/WeekHeader";
import Link from "next/link";
import { addWeeks, startOfWeek, format } from "date-fns";
import { Suspense } from "react";
import { Loader } from "@/components/loader-4";

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-[inter-regular]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      </main>
    </div>
  );
}

async function HomeContent() {
  const weekId = getCurrentWeekId();
  const session = await getSession();

  const launches = await getWeekLaunches(weekId, session?.user?.id);

  const now = new Date();
  const thisMonday = startOfWeek(now, { weekStartsOn: 1 });
  const lastMonday = addWeeks(thisMonday, -1);
  const prevWeekId = `${lastMonday.getFullYear()}-W${format(lastMonday, "ww")}`;

  const mapped = launches.map((l) => ({
    ...l,
    userHasVoted: l.votes.length > 0,
  }));

  return (
    <>
      <WeekHeader
        weekId={weekId}
        prevWeekId={prevWeekId}
        nextWeekId={null}
        launchCount={launches.length}
      />

      {mapped.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="text-lg font-[inter-medium] text-secondary">Nothing shipped yet this week</p>
          <p className="text-sm mt-1">Be the first builder to launch something</p>
          <Link
            href="/submit"
            className="inline-block mt-4 bg-purple-500 hover:bg-purple-400 text-black text-sm font-[inter-medium] px-5 py-2 rounded-sm transition-colors"
          >
            Submit your launch
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mapped.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}
    </>
  );
}
