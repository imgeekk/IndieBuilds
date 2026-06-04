"use client";

import { useState, useCallback } from "react";

export function useVote() {
  const [loading, setLoading] = useState(false);

  const toggleVote = useCallback(async (launchId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/launches/${launchId}/vote`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        return data as { voted: boolean };
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggleVote, loading };
}
