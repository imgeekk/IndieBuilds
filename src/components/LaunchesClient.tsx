"use client";
import { useLaunches } from "@/hooks/useLaunches";
import LaunchCard from "@/components/LaunchCard";
import WeekHeader from "@/components/WeekHeader";
import Link from "next/link";
import type { ApiLaunch } from "@/lib/types";
export default function LaunchesClient({
  weekId,
  prevWeekId,
  nextWeekId,
  initialLaunches,
  currentUserGithubHandle,
  isCurrentWeek,
}: {
  weekId: string;
  prevWeekId: string | null;
  nextWeekId: string | null;
  initialLaunches: ApiLaunch[];
  currentUserGithubHandle: string | null;
  isCurrentWeek: boolean;
}) {
  const { launches = initialLaunches } = useLaunches(weekId, initialLaunches);
  return (
    <>
      <WeekHeader
        weekId={weekId}
        prevWeekId={prevWeekId}
        nextWeekId={nextWeekId}
        launchCount={launches.length}
      />
      {launches.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="text-lg font-[inter-medium] text-secondary">Nothing shipped this week</p>
          <p className="text-sm mt-1">Be the first builder to launch something</p>
          {isCurrentWeek && (
            <Link
              href="/submit"
              className="inline-block mt-4 bg-purple-500 hover:bg-purple-400 text-white text-sm font-[inter-medium] px-5 py-2 rounded-sm transition-colors"
            >
              Submit your launch
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {launches.map((launch: ApiLaunch) => (
            <LaunchCard key={launch.id} launch={launch} currentUserGithubHandle={currentUserGithubHandle} />
          ))}
        </div>
      )}
    </>
  );
}