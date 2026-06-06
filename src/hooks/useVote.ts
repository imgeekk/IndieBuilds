"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export function useVote() {
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
      await queryClient.cancelQueries({ queryKey: queryKeys.launches.all });

      const previousLaunches = queryClient.getQueriesData({queryKey: queryKeys.launches.all});

      queryClient.setQueriesData({queryKey: queryKeys.launches.all}, (old: any) => {
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
      return { previousLaunches };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.launches.all });
    },
    onError: (err, launchId, context) => {
      if (context?.previousLaunches) {
        queryClient.setQueriesData({ queryKey: queryKeys.launches.all }, context.previousLaunches);
      }
    },
  });

  return { toggleVote: toggleVote.mutate };
}
