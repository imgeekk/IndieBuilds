"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export function useVote(weekId: string) {
  const queryClient = useQueryClient();

  const toggleVote = useMutation({
    mutationFn: async (launchId: string) => {
      const res = await fetch(`/api/launches/${launchId}/vote`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to toggle vote");
      }
      return res.json() as Promise<{ voted: boolean }>;
    },
    onMutate: async (launchId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.launches(weekId) });

      queryClient.setQueriesData({ queryKey: queryKeys.launches(weekId) }, (old: any) => {
        if (!old) return old;

        return old.map((launch: any) => {
          if (launch.id === launchId) {
            const hasVoted = launch.userHasVoted;
            return {
              ...launch,
              userHasVoted: !hasVoted,
              _count: {
                ...launch._count,
                votes: hasVoted
                  ? launch._count.votes - 1
                  : launch._count.votes + 1,
              },
            };
          }
          return launch;
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.launches(weekId) });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.launches(weekId) });
    },
  });

  return { toggleVote: toggleVote.mutate };
}