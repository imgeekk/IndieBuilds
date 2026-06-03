import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatWeekLabel } from "../../../lib/week";
import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import WeekHeader from "@/components/WeekHeader";
import { addWeeks, startOfWeek, format, parseISO } from "date-fns";
import { notFound } from "next/navigation";

export default async function WeekPage({ params }: { params: { weekId: string } }) {
  const { weekId } = params;
  const session = await getSession();

  const week = await prisma.week.findUnique({ where: { id: weekId } });
  if (!week) notFound();

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

  // prev / next week IDs
  const weekStart = startOfWeek(week.startDate, { weekStartsOn: 1 });
  const prev = addWeeks(weekStart, -1);
  const next = addWeeks(weekStart, 1);
  const prevWeekId = `${prev.getFullYear()}-W${format(prev, "ww")}`;
  const nextWeekId = `${next.getFullYear()}-W${format(next, "ww")}`;

  // don't show "next" if it's in the future
  const isNextFuture = next > new Date();

  const mapped = launches.map((l) => ({
    ...l,
    userHasVoted: session?.user ? l.votes.length > 0 : false,
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}