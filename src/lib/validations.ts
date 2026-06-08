import {z} from "zod";

export const createLaunchSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  tagline: z.string().min(1, "Tagline is required").max(100),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  stack: z.array(z.string()).max(8).default([]),
});
export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(500),
  isRoast: z.boolean().default(false),
});