"use client";

import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Comment = {
  id: string;
  body: string;
  isRoast: boolean;
  createdAt: string;
  user: { name: string; githubHandle: string | null; image: string | null };
};

export function useComments(launchId: string) {

  const {data: comments, isLoading: loading, error} = useQuery({
    queryKey: queryKeys.comments.byLaunch(launchId),
    queryFn: async () => {
      const res = await fetch(`/api/launches/${launchId}/comments`);
      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }
      return res.json();
    },
  })

  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationFn: async ({body, isRoast}: {body: string, isRoast: boolean}) => {
      const res = await fetch(`/api/launches/${launchId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, isRoast }),
      });
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
      return res.json() as Promise<Comment>;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.byLaunch(launchId) });

      const previousComments = queryClient.getQueryData(queryKeys.comments.byLaunch(launchId));

      queryClient.setQueryData(queryKeys.comments.byLaunch(launchId), (old: any) => {
        if (!old) return old;
        return [ { ...newComment, id: "temp-id", createdAt: new Date().toISOString(), user: { name: "You", githubHandle: null, image: null } }, ...old ];
      });

      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byLaunch(launchId) });
    },
    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKeys.comments.byLaunch(launchId), context.previousComments);
      }
    },
  })



  return { comments, loading, error, addComment: addComment.mutateAsync, submitting: addComment.isPending };
}
