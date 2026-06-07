"use client";

import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useVote } from "@/hooks/useVote";
import { useRouter } from "next/navigation";
import { FaExternalLinkAlt, FaImage } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineComment } from "react-icons/md";

type Launch = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  stack: string[];
  ogImage?: string | null;
  user: { name: string; githubHandle: string | null; image: string | null };
  _count: { votes: number; comments: number };
  userHasVoted?: boolean;
};

export default function LaunchCard({ launch, currentUserGithubHandle }: { launch: Launch; currentUserGithubHandle: string | null }) {
  const { toggleVote } = useVote();
  const router = useRouter();

  async function handleVote() {
    if (!currentUserGithubHandle) {
      signIn.social({ provider: "github", callbackURL: "/" });
      return;
    }
    toggleVote(launch.id);
    
  }

  return (
    <div
      className="flex flex-col rounded-md bg-card border h-102 border-card-border hover:border-purple-500 shadow-xs transition-colors text-foreground font-[inter-regular] overflow-hidden"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/launch/${launch.id}`);
      }}
    >
      {/* OG Image Banner */}
      <div className="relative w-full aspect-video shrink-0 bg-card-border">
        {launch.ogImage ? (
          <img
            src={launch.ogImage}
            alt={launch.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted/30">
            <FaImage size={32} />
          </div>
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="h-full flex items-start gap-3">
          {/* Vote button */}
          <button
            onClick={handleVote}
            className={`flex flex-col items-center justify-center min-w-13 h-13 rounded-sm border text-sm cursor-pointer font-[inter-semibold] transition-colors ${
              launch.userHasVoted
                ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                : "bg-card border-card-border text-muted hover:border-zinc-500 hover:text-foreground"
            }`}
          >
            <span className="text-xs">▲</span>
            <span>{launch._count.votes}</span>
          </button>

          <div className="flex-1 h-full min-w-0 flex flex-col justify-between">
            <section className="">
              <div className="flex items-center gap-2">
                <span className="font-[inter-semibold] text-foreground">
                  {launch.name}
                </span>
                <a
                  href={launch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaExternalLinkAlt size={13} />
                </a>
              </div>
              <p className="text-sm text-muted mt-0.5">{launch.tagline}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* Stack chips */}
                {launch.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-card text-muted px-2 py-0.5 rounded-md border border-card-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
            <div className="mt-auto pt-3 flex items-center gap-3 flex-wrap">
                {/* Builder share — left side */}
                {currentUserGithubHandle === launch.user.githubHandle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
                    className="bg-purple-500 hover:bg-purple-400 text-white text-xs font-[inter-medium] px-4 py-2 rounded-xs transition-colors flex gap-1 items-center cursor-alias"
                  >
                    Share your launch on <FaXTwitter size={14} />
                  </button>
                )}
                <div className="ml-auto flex items-center gap-3">
                  <Link
                    href={`/profile/${launch.user.githubHandle ?? ""}`}
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={launch.user.image ?? ""}
                      alt={launch.user.name}
                      className="w-6 h-6 rounded-full"
                      loading="lazy"
                    />
                    {launch.user.githubHandle ?? launch.user.name}
                  </Link>

                  {/* Comment count */}
                  <Link
                    href={`/launch/${launch.id}`}
                    className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdOutlineComment size={16} />
                    {launch._count.comments}
                  </Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
