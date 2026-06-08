import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import ActivityGrid from "@/components/ActivityGrid";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserByGithubHandle, getUserLaunches } from "@/lib/services";
import { FaFire } from "react-icons/fa";
import { getLastNWeeks } from "@/lib/week";
import { Suspense } from "react";
import Link from "next/link";
import { Loader } from "@/components/loader-4";

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <div className="min-h-screen bg-background text-secondary font-[inter-regular]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          }
        >
          <ProfileContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function ProfileContent({ params }: { params: { username: string } }) {
  const session = await getSession();

  const user = await getUserByGithubHandle(params.username);

  if (!user) notFound();

  const launches = await getUserLaunches(user.id, session?.user?.id);

  const totalVotes = launches.reduce((acc, l) => acc + l._count.votes, 0);

  const last10Weeks = getLastNWeeks(10);
  const activeWeeks = launches.map((l) => l.weekId);
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img
            src={user.image ?? ""}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-card-border shrink-0"
            loading="lazy"
          />
          <div>
            <h1 className="text-xl font-[inter-semibold] text-foreground">
              {user.name}
            </h1>
            <a
              href={`https://github.com/${user.githubHandle}`}
              target="_blank"
              className="text-sm text-muted hover:text-purple-400 transition-colors hover:underline "
            >
              @{user.githubHandle}
            </a>
            {user.bio && <p className="text-sm text-muted mt-1">{user.bio}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center md:ml-auto md:items-end gap-3">
          <div className="flex items-center gap-4 md:gap-6 text-center">
            <div>
              <p className="text-2xl font-[inter-bold] text-foreground">
                {launches.length}
              </p>
              <p className="text-xs text-muted">Launches</p>
            </div>
            <div>
              <p className="text-2xl font-[inter-bold] text-foreground">
                {totalVotes}
              </p>
              <p className="text-xs text-muted">Total votes</p>
            </div>
            <div>
              <p className="text-2xl font-[inter-bold] text-purple-400 flex items-center gap-1 leading-none">
                <FaFire size={18} /> {user.streak}
              </p>
              <p className="text-xs text-muted mt-1">week streak</p>
            </div>
          </div>
          <div className="overflow-x-auto max-w-full">
            <ActivityGrid activeWeeks={activeWeeks} allWeeks={last10Weeks} />
          </div>
        </div>
      </div>

      {launches.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="text-lg font-[inter-medium] text-secondary">
            {session?.user?.id === user.id
              ? "You haven't launched anything yet"
              : "This user hasn't launched anything yet"}
          </p>
          <p className="text-sm mt-1">
            {session?.user?.id === user.id
              ? "Ship something this week to start your streak"
              : "Check back later"}
          </p>
          {session?.user?.id === user.id && (
            <Link
              href="/submit"
              className="inline-block mt-4 bg-purple-500 hover:bg-purple-400 text-white text-sm font-[inter-medium] px-5 py-2 rounded-sm transition-colors"
            >
              Submit your launch
            </Link>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-sm font-[inter-medium] text-muted uppercase mb-4">
            All launches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {launches.map((l) => (
              <LaunchCard
                key={l.id}
                launch={l}
                currentUserGithubHandle={session?.user.githubHandle || null}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
