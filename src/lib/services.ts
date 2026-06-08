import { prisma } from "@/lib/prisma";
import { ApiComment, ApiLaunch } from "./types";

// Week services

export function getWeekById(weekId: string) {
  return prisma.week.findUnique({ where: { id: weekId } });
}

// User services

export function getUserByGithubHandle(githubHandle: string) {
  return prisma.user.findFirst({ where: { githubHandle } });
}

export function touchUserLastShipped(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { lastShippedAt: new Date() },
  });
}

// Launch services

export async function getWeekLaunches(
  weekId: string,
  userId?: string,
): Promise<ApiLaunch[]> {
  const launches = await prisma.launch.findMany({
    where: { weekId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      votes: { where: { userId: userId ?? "" }, select: { id: true } },
    },
    orderBy: { votes: { _count: "desc" } },
  });
  return launches.map((l) => ({
    id: l.id,
    name: l.name,
    tagline: l.tagline,
    url: l.url,
    weekId: l.weekId,
    stack: l.stack,
    ogImage: l.ogImage,
    user: l.user,
    _count: l._count,
    userHasVoted: l.votes.length > 0,
  }));
}

export async function getUserLaunches(
  userId: string,
  currentUserId?: string,
): Promise<ApiLaunch[]> {
  const launches = await prisma.launch.findMany({
    where: { userId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      votes: { where: { userId: currentUserId ?? "" }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return launches.map((l) => ({
    id: l.id,
    name: l.name,
    tagline: l.tagline,
    url: l.url,
    weekId: l.weekId,
    stack: l.stack,
    ogImage: l.ogImage,
    user: l.user,
    _count: l._count,
    userHasVoted: l.votes.length > 0,
  }));
}

export function getLaunchById(id: string) {
  return prisma.launch.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      week: true,
    },
  });
}

export function getLaunchMetaById(id: string) {
  return prisma.launch.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, githubHandle: true } },
    },
  });
}

export function getLaunchExists(id: string) {
  return prisma.launch.findUnique({ where: { id } });
}

export function getExistingUserLaunch(userId: string, weekId: string) {
  return prisma.launch.findUnique({
    where: { userId_weekId: { userId, weekId } },
  });
}

export function createLaunch(data: {
  name: string;
  tagline: string;
  url: string;
  description?: string;
  ogImage?: string;
  stack: string[];
  userId: string;
  weekId: string;
}) {
  return prisma.launch.create({ data });
}

// Vote services

export async function toggleVote(launchId: string, userId: string) {
  const existing = await prisma.vote.findUnique({
    where: { userId_launchId: { userId, launchId } },
  });

  if (existing) {
    await prisma.vote.delete({
      where: { userId_launchId: { userId, launchId } },
    });
    return { voted: false };
  } else {
    await prisma.vote.create({
      data: { userId, launchId },
    });
    return { voted: true };
  }
}

// Comment services

export async function getComments(launchId: string): Promise<ApiComment[]> {
  const comments = await prisma.comment.findMany({
    where: { launchId },
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return comments.map((c) => ({
    id: c.id,
    body: c.body,
    isRoast: c.isRoast,
    createdAt: c.createdAt.toISOString(),
    user: c.user,
  }));
}

export async function createComment(data: {
  body: string;
  isRoast: boolean;
  userId: string;
  launchId: string;
}): Promise<ApiComment> {
  const comment = await prisma.comment.create({
    data,
    include: {
      user: { select: { name: true, githubHandle: true, image: true } },
    },
  });
  return {
    id: comment.id,
    body: comment.body,
    isRoast: comment.isRoast,
    createdAt: comment.createdAt.toISOString(),
    user: comment.user,
  };
}
