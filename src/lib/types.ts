export type ApiLaunch = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  weekId: string;
  stack: string[];
  ogImage: string | null;
  user: { name: string; githubHandle: string | null; image: string | null };
  _count: { votes: number; comments: number };
  userHasVoted: boolean;
};
export type ApiComment = {
  id: string;
  body: string;
  isRoast: boolean;
  createdAt: string;
  user: { name: string; githubHandle: string | null; image: string | null };
};