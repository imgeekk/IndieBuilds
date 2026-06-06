"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

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

export function useLaunches(weekId: string, initialData?: Launch[] ) {
  const { data: launches, isLoading, error } = useQuery({
    queryKey: queryKeys.launches.byWeek(weekId),
    queryFn: async () => {
      const res = await fetch(`/api/launches?weekId=${weekId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch launches");
      }
      return res.json();
    },
  });
return { launches: launches ?? initialData, isLoading, error };
}