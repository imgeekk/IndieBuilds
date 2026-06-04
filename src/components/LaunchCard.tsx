"use client";

import Link from "next/link";
import { useSession, signIn } from "@/lib/auth-client";
import { useVote } from "@/hooks/useVote";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExternalLinkAlt, FaTwitter } from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
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
  const router = useRouter();

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
    <div className="flex gap-4 p-4 rounded-md bg-card border border-card-border hover:border-purple-500 shadow-xs transition-colors text-foreground font-[inter-regular]"
    onClick={(e) => {
      e.preventDefault();
      router.push(`/launch/${launch.id}`);
    }}
    >
      {/* Vote button */}
      <button
        onClick={handleVote}
        disabled={loading}
        className={`flex flex-col items-center justify-center min-w-13 h-13 rounded-sm border text-sm cursor-pointer font-[inter-semibold] transition-colors
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
          <div className="flex-1 flex items-center justify-end gap-3" >

          {/* Builder */}
          {session?.user.githubHandle === launch.user.githubHandle && (
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `Check out my launch at IndieBuilds: ${launch.name} - ${launch.tagline}`
              );
              const url = encodeURIComponent(
                `${process.env.NEXT_PUBLIC_APP_URL}/launch/${launch.id}`
              );
              window.open(
                `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className=" bg-purple-500 hover:bg-purple-400 text-white text-xs font-[inter-medium] px-4 py-2 rounded-xs transition-colors flex gap-1 items-center cursor-alias"
          >
            Share your launch on <FaXTwitter size={14}  />
          </button>
        )}
          <Link
            href={`/profile/${launch.user.githubHandle ?? ""}`}
            className=" flex items-center gap-1.5 text-sm text-foreground hover:text-secondary transition-colors"
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
        </div>
      </div>
    </div>
  );
}
