import { getSession } from "@/lib/session";
import { formatWeekLabel } from "@/lib/week";
import { getWeekById, getWeekLaunches } from "@/lib/services";
import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import WeekHeader from "@/components/WeekHeader";
import { addWeeks, startOfWeek, format } from "date-fns";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "@/components/loader-4";

export default function WeekPage({ params }: { params: { weekId: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          }
        >
          <WeekContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function WeekContent({ params }: { params: { weekId: string } }) {
  const { weekId } = await params;
  const session = await getSession();

  const week = await getWeekById(weekId);
  if (!week) notFound();

  const launches = await getWeekLaunches(weekId, session?.user?.id);

  const weekStart = startOfWeek(week.startDate, { weekStartsOn: 1 });
  const prev = addWeeks(weekStart, -1);
  const next = addWeeks(weekStart, 1);
  const prevWeekId = `${prev.getFullYear()}-W${format(prev, "ww")}`;
  const nextWeekId = `${next.getFullYear()}-W${format(next, "ww")}`;
  const isNextFuture = next > new Date();

  const mapped = launches.map((l) => ({
    ...l,
    userHasVoted: l.votes.length > 0,
  }));

  return (
    <>
      <WeekHeader
        weekId={weekId}
        prevWeekId={prevWeekId}
        nextWeekId={isNextFuture ? null : nextWeekId}
        launchCount={launches.length}
      />
      <div className="flex flex-col gap-3">
        {mapped.map((l) => (
          <LaunchCard key={l.id} launch={l} />
        ))}
      </div>
    </>
  );
}
