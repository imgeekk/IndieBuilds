"use client";

import Link from "next/link";
import { useSession, signIn } from "@/lib/auth-client";
import { useVote } from "@/hooks/useVote";
import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import CopyButton from "./CopyButton";
import { MdOutlineComment } from "react-icons/md";

type Launch = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  stack: string[];
  user: { name: string; githubHandle: string | null; image: string | null };
  _count: { votes: number; comments: number };
  userHasVoted?: boolean;
};

export default function LaunchCard({ launch }: { launch: Launch }) {
  const { data: session } = useSession();
  const { toggleVote, loading } = useVote();
  const [votes, setVotes] = useState(launch._count.votes);
  const [voted, setVoted] = useState(launch.userHasVoted ?? false);

  async function handleVote() {
    if (!session) {
      signIn.social({ provider: "github", callbackURL: "/" });
      return;
    }
    const result = await toggleVote(launch.id);
    if (result) {
      setVoted(result.voted);
      setVotes((v) => (result.voted ? v + 1 : v - 1));
    }
  }

  return (
    <div className="flex gap-4 p-4 rounded-md bg-card border border-card-border hover:border-purple-500 shadow-xs transition-colors text-foreground font-[inter-regular]">
      {/* Vote button */}
      <button
        onClick={handleVote}
        disabled={loading}
        className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-sm border text-sm cursor-pointer font-[inter-semibold] transition-colors
          ${
            voted
              ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
              : "bg-card border-card-border text-muted hover:border-zinc-500 hover:text-foreground"
          }`}
      >
        <span className="text-xs">▲</span>
        <span>{votes}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-[inter-semibold] text-foreground">
                {launch.name}
              </span>
              <a
                href={launch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                <FaExternalLinkAlt size={13} />
              </a>
            </div>
            <p className="text-sm text-muted mt-0.5">{launch.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 flex-wrap">
          {/* Stack chips */}
          {launch.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs bg-card text-muted px-2 py-0.5 rounded-md border border-card-border"
            >
              {tech}
            </span>
          ))}

          {/* Builder */}
          <Link
            href={`/profile/${launch.user.githubHandle ?? ""}`}
            className="ml-auto flex items-center gap-1.5 text-sm text-foreground hover:text-secondary transition-colors"
          >
            <img
              src={launch.user.image ?? ""}
              alt={launch.user.name}
              className="w-6 h-6 rounded-full"
            />
            {launch.user.githubHandle ?? launch.user.name}
          </Link>

          {/* Comment count */}
          <Link
            href={`/launch/${launch.id}`}
            className="flex items-center gap-1 text-sm text-foreground hover:text-secondary transition-colors"
          >
            <MdOutlineComment size={16} />
            {launch._count.comments}
          </Link>
        </div>
        {/* Shareable badge — add inside LaunchPage after the stats div */}
        {session?.user.githubHandle === launch.user.githubHandle && (
          <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Share your launch</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
              value={`${process.env.NEXT_PUBLIC_APP_URL}/launch/${launch.id}`}
              className="flex-1 text-xs bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-zinc-300 outline-none"
            />
            <CopyButton
              text={`${process.env.NEXT_PUBLIC_APP_URL}/launch/${launch.id}`}
            />
          </div>
        </div>)}
      </div>
    </div>
  );
}
