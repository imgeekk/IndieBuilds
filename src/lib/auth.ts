import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile: any) => ({
        name: profile.name || profile.login,
        githubHandle: profile.login,
        image: profile.avatar_url,
      }),
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // refresh if older than 1 day
  },

   callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            githubHandle: (profile as any).login,
            image: (profile as any).avatar_url,
          },
        });
      }
      return true;
    },
  },
});

export type Session = typeof auth.$Infer.Session;