"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaFire } from "react-icons/fa";

type Comment = {
  id: string;
  body: string;
  isRoast: boolean;
  createdAt: string;
  user: { name: string; githubHandle: string | null; image: string | null };
};

export default function CommentSection({ launchId }: { launchId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [isRoast, setIsRoast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/launches/${launchId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [launchId]);

  async function handleSubmit() {
    if (!body.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/launches/${launchId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, isRoast }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((c) => [...c, newComment]);
      setBody("");
      setIsRoast(false);
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-[inter-medium] text-muted uppercase tracking-widest mb-4">
        Discussion ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="flex flex-col gap-4 mb-6">
        {loading && (
          <p className="text-sm text-muted">Loading comments...</p>
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
                <span className="text-xs text-card-border ml-auto">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
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
                {submitting ? "Posting..." : isRoast ? "🔥 Roast it" : "Post"}
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
  );
}