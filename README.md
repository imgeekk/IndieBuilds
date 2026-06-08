# IndieBuilds

A weekly showcase of what indie developers shipped. One launch per week, per builder.

## How it works

Every week starts fresh. Builders submit their launch with a name, tagline, URL, and what they built it with. The community votes on what they like and drops feedback in the comments (or roasts, if that's your thing).

Each builder gets a profile showing their shipping streak, total votes, and every launch they've ever posted. Miss a week and your streak resets.

## Built with

- Next.js 16 (App Router)
- Prisma + PostgreSQL (Neon)
- TanStack Query
- Better Auth (GitHub OAuth)
- Tailwind CSS
- Zod
- date-fns
- Deployed on Vercel

## Local dev

```bash
npm install
cp .env.example .env   # fill in your env vars
npx prisma generate
npx prisma db push
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | At least 32 chars, generated with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` for dev |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for dev |
