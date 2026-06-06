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
import HomeClient from "@/components/HomeClient";

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
    <HomeClient
      weekId={weekId}
      prevWeekId={prevWeekId}
      initialLaunches={mapped}
    />
  );
}
