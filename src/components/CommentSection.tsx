"use client";

import { useState } from "react";
import { useSession, signIn } from "@/lib/auth-client";
import { useComments } from "@/hooks/useComments";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaFire } from "react-icons/fa";
import { Loader } from "@/components/loader-4";
import { Spinner } from "@/components/ui/spinner";

export default function CommentSection({ launchId }: { launchId: string }) {
  const { data: session } = useSession();
  const { comments, loading, addComment, submitting } = useComments(launchId);
  const [body, setBody] = useState("");
  const [isRoast, setIsRoast] = useState(false);

  async function handleSubmit() {
    if (!body.trim()) return;

  await addComment({body, isRoast});
      setBody("");
      setIsRoast(false);
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-[inter-semibold] text-muted uppercase mb-4">
        Discussion ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-muted">
            No comments yet. Be the first to give feedback — or a roast.
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className={`flex gap-3 p-3 rounded-md border ${
              c.isRoast
                ? "border-purple-500/30 bg-purple-500/5"
                : "border-card-border bg-card"
            }`}
          >
            <img
              src={c.user.image ?? ""}
              alt={c.user.name}
              className="w-7 h-7 rounded-full shrink-0 mt-0.5"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/profile/${c.user.githubHandle}`}
                  className="text-xs font-[inter-mediumn] text-secondary hover:text-foreground transition-colors"
                >
                  {c.user.githubHandle ?? c.user.name}
                </Link>
                {c.isRoast && (
                  <span className="flex items-center gap-0.5 text-xs text-purple-400">
                    <FaFire size={11} /> roast
                  </span>
                )}
                <span className="text-[10px] text-muted ml-auto">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background z-10 border-t border-card-border pt-4 pb-2">
        <div className="absolute bottom-full left-0 right-0 h-6 bg-linear-to-t from-background to-transparent pointer-events-none" />
      {session ? (
        <div className="border border-card-border rounded-md p-4 bg-card">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What do you think? Drop honest feedback or a roast..."
            rows={3}
            maxLength={500}
            className="w-full bg-transparent text-sm text-foreground placeholder-muted outline-none resize-none"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setIsRoast((r) => !r)}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  isRoast ? "bg-purple-500" : "bg-card-border"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                    isRoast ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-xs text-muted flex items-center gap-1">
                <FaFire size={12} className={isRoast ? "text-purple-400" : ""} />
                Roast mode
              </span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-card-border">{body.length}/500</span>
              <button
                onClick={handleSubmit}
                disabled={submitting || !body.trim()}
                className="bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-white text-sm font-[inter-medium] px-4 py-1.5 rounded-sm transition-colors"
              >
                {submitting ? <Spinner size="sm" className="text-white" /> : isRoast ? "Roast it" : "Post"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn.social({ provider: "github", callbackURL: window.location.href })}
          className="w-full py-3 border border-card-border rounded-sm text-sm text-muted hover:text-foreground hover:border-zinc-500 transition-colors"
        >
          Sign in with GitHub to comment
        </button>
      )}
      </div>
    </div>
  );
}