"use client";

import { useState, useCallback } from "react";

export function useSubmitLaunch() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = useCallback(async (data: {
    name: string;
    tagline: string;
    url: string;
    description?: string;
    stack: string[];
  }) => {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/launches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        return true;
      } else {
        const body = await res.json();
        setError(body.error ?? "Something went wrong.");
        return false;
      }
    } catch {
      setError("Something went wrong.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error, setError };
}
