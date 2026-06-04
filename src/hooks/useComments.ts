"use client";

import { useState, useEffect, useCallback } from "react";

export type Comment = {
  id: string;
  body: string;
  isRoast: boolean;
  createdAt: string;
  user: { name: string; githubHandle: string | null; image: string | null };
};

export function useComments(launchId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/launches/${launchId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data))
      .finally(() => setLoading(false));
  }, [launchId]);

  const addComment = useCallback(
    async (body: string, isRoast: boolean) => {
      const res = await fetch(`/api/launches/${launchId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, isRoast }),
      });

      if (res.ok) {
        const newComment: Comment = await res.json();
        setComments((c) => [newComment, ...c]);
        return true;
      }
      return false;
    },
    [launchId],
  );

  return { comments, loading, addComment };
}
