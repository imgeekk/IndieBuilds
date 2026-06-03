import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import LaunchCard from "@/components/LaunchCard";
import ActivityGrid from "@/components/ActivityGrid";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { FaFire } from "react-icons/fa";
import { getLastNWeeks } from "@/lib/week";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getSession();

  const user = await prisma.user.findFirst({
    where: { githubHandle: params.username },
  });

  if (!user) notFound();

  const launches = await prisma.launch.findMany({
    where: { userId: user.id },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      votes: session?.user
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalVotes = launches.reduce((acc, l) => acc + l._count.votes, 0);

  const last10Weeks = getLastNWeeks(10);
  const activeWeeks = launches.map((l) => l.weekId);

  const mapped = launches.map((l) => ({
    ...l,
    userHasVoted: session?.user ? l.votes.length > 0 : false,
  }));

  return (
    <div className="min-h-screen bg-[#EEF0E8] text-zinc-700 font-[inter-regular]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={user.image ?? ""}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-zinc-400"
          />
          <div>
            <h1 className="text-xl font-[inter-semibold]   ">{user.name}</h1>
            <a
              href={`https://github.com/${user.githubHandle}`}
              target="_blank"
              className="text-sm text-zinc-500 hover:text-orange-400 transition-colors hover:underline "
            >
              @{user.githubHandle}
            </a>
            {user.bio && (
              <p className="text-sm text-zinc-400 mt-1">{user.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="ml-auto flex items-start gap-6 text-center">
            <div>
              <p className="text-2xl font-[inter-bold]   ">{launches.length}</p>
              <p className="text-xs text-zinc-500">launches</p>
            </div>
            <div className="mr-2">
              <p className="text-2xl font-[inter-bold]">{totalVotes}</p>
              <p className="text-xs text-zinc-500">total votes</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-[inter-bold] text-orange-400 flex items-center gap-1 leading-none">
                  <FaFire size={18} /> {user.streak}
                </p>
                <p className="text-xs text-zinc-500 mt-1">week streak</p>
              </div>
              <ActivityGrid activeWeeks={activeWeeks} allWeeks={last10Weeks} />
            </div>
          </div>
        </div>

        {/* Launches */}
        <h2 className="text-sm font-[inter-medium] text-zinc-500 uppercase tracking-widest mb-4">
          All launches
        </h2>
        <div className="flex flex-col gap-3">
          {mapped.map((l) => (
            <LaunchCard key={l.id} launch={l} />
          ))}
        </div>
      </main>
    </div>
  );
}
