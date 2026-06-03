import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";
import {FaExternalLinkAlt, FaArrowLeft} from "react-icons/fa";
import Link from "next/link";

export default async function LaunchPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const { id: launchId } = await params;
  const launch = await prisma.launch.findUnique({
    where: { id: launchId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      week: true,
    },
  });

  if (!launch) notFound();

  return (
    <div className="min-h-screen bg-background text-secondary font-[inter-regular]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Back */}
        <Link
          href={`/week/${launch.weekId}`}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <FaArrowLeft size={14} />
          Back to week
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-[inter-bold] text-foreground">{launch.name}</h1>
              <p className="text-muted mt-1">{launch.tagline}</p>
            </div>
            <a
              href={launch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-[inter-medium] px-4 py-2 rounded-sm transition-colors shrink-0"
            >
              Visit <FaExternalLinkAlt size={13} />
            </a>
          </div>

          {/* Stack */}
          {launch.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {launch.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-card text-muted px-2.5 py-1 rounded-md border border-card-border"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {launch.description && (
            <p className="text-sm text-muted leading-relaxed mt-4 p-4 bg-card rounded-md border border-card-border">
              {launch.description}
            </p>
          )}

          {/* Builder + stats */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-card-border">
            <Link
              href={`/profile/${launch.user.githubHandle}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <img
                src={launch.user.image ?? ""}
                alt={launch.user.name}
                className="w-6 h-6 rounded-full"
              />
              {launch.user.githubHandle ?? launch.user.name}
            </Link>
            <span className="text-card-border text-sm">·</span>
            <span className="text-sm text-muted">{launch._count.votes} votes</span>
            <span className="text-card-border text-sm">·</span>
            <span className="text-sm text-muted">{launch._count.comments} comments</span>
          </div>
        </div>

        {/* Comments */}
        <CommentSection launchId={launch.id} />

      </main>
    </div>
  );
}