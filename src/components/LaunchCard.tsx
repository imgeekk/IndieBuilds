"use client";

import Link from "next/link";
import { useSession, signIn } from "@/lib/auth-client";
import { useState } from "react";
import { FaExternalLinkAlt, FaFacebookMessenger } from "react-icons/fa";

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
  const [votes, setVotes] = useState(launch._count.votes);
  const [voted, setVoted] = useState(launch.userHasVoted ?? false);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (!session) {
      signIn.social({ provider: "github", callbackURL: "/" });
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/launches/${launch.id}/vote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setVoted(data.voted);
      setVotes((v) => (data.voted ? v + 1 : v - 1));
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-4 p-4 rounded-sm border border-zinc-300 bg-white hover:border-zinc-400 shadow-sm transition-colors text-zinc-700 font-[inter-regular]">

      {/* Vote button */}
      <button
        onClick={handleVote}
        disabled={loading}
        className=
          {`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xs border text-sm cursor-pointer font-[inter-semibold] transition-colors
          ${voted
            ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
            : "bg-zinc-100 border-zinc-500 text-zinc-500 hover:border-zinc-500 hover:text-zinc-400"
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
              <span className="font-[inter-semibold] ">{launch.name}</span>
              <a
                href={launch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-400 transition-colors"
              >
                <FaExternalLinkAlt size={13} />
              </a>
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{launch.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {/* Stack chips */}
          {launch.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md border border-zinc-700">
              {tech}
            </span>
          ))}

          {/* Builder */}
          <Link
            href={`/profile/${launch.user.githubHandle ?? ""}`}
            className="ml-auto flex items-center gap-1.5 text-xs text-zinc-900 hover:text-zinc-800 transition-colors"
          >
            <img
              src={launch.user.image ?? ""}
              alt={launch.user.name}
              className="w-4 h-4 rounded-full"
            />
            {launch.user.githubHandle ?? launch.user.name}
          </Link>

          {/* Comment count */}
          <Link
            href={`/launch/${launch.id}`}
            className="flex items-center gap-1 text-xs text-zinc-900 hover:text-zinc-800 transition-colors"
          >
            <FaFacebookMessenger size={12} />
            {launch._count.comments}
          </Link>
        </div>
      </div>

    </div>
  );
}