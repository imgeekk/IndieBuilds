export const queryKeys = {
  launches: {
    all: ["launches"] as const,
    byWeek: (weekId: string) => ["launches", "week", weekId] as const,
  },
  comments : {
    byLaunch: (launchId: string) => ["comments", "launch", launchId] as const,
  },
};