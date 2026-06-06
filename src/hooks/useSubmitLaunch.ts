"use client";

import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSubmitLaunch() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = useMutation({
    mutationFn: async (data: {
      name: string;
      tagline: string;
      url: string;
      description?: string;
      stack: string[];
    }) => {
      const res = await fetch("/api/launches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Something went wrong.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.launches.all });
      router.push("/");
    },
    onError: (err: any) => {
      setError(err.message || "Something went wrong.");
    },
  });

  return {
    submit: submit.mutate,
    submitting: submit.isPending,
    error: submit.error?.message,
    setError,
  };
}
