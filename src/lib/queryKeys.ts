export const queryKeys = {
  launches: (weekId?: string) =>
    weekId ? ["launches", weekId] as const : ["launches"] as const,
  comments: (launchId: string) => ["comments", launchId] as const,
};