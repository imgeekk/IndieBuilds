import { z } from "zod";

export const createLaunchSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  tagline: z.string().min(1, "Tagline is required").max(100),
  url: z.url({ protocol: /^https?$/ }).refine(
    (url) => {
      try {
        const { hostname } = new URL(url);
        return !["localhost", "127.0.0.1", "::1"].includes(hostname);
      } catch {
        return false;
      }
    },
    {
      message: "Local URLs are not allowed",
    },
  ),
  description: z.string().optional(),
  stack: z.array(z.string()).max(8).default([]),
});
export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(500),
  isRoast: z.boolean().default(false),
});
