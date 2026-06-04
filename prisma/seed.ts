import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();
  const start = addWeeks(now, -52);
  for (let i = 0; i < 104; i++) {
    const weekStart = startOfWeek(addWeeks(start, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(addWeeks(start, i), { weekStartsOn: 1 });
    const year = weekStart.getFullYear();
    const weekNum = format(weekStart, "ww");
    const weekId = `${year}-W${weekNum}`;
    await prisma.week.upsert({
      where: { id: weekId },
      update: {},
      create: { id: weekId, startDate: weekStart, endDate: weekEnd },
    });
  }
  console.log("✓ Seeded 104 weeks");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());