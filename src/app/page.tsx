import { getSession } from "@/lib/session";
import { getCurrentWeekId, getPrevWeekId } from "@/lib/week";
import { getWeekLaunches } from "@/lib/services";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { Loader } from "@/components/loader-4";
import LaunchesClient from "@/components/LaunchesClient";

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


  return (
    <LaunchesClient
      weekId={weekId}
      prevWeekId={getPrevWeekId(weekId)}
      nextWeekId={null} // Obv there is no next week dude cuz this is the current week page
      initialLaunches={launches}
      currentUserGithubHandle={session?.user?.githubHandle || null}
      isCurrentWeek={true}
    />
  );
}
