import { startOfWeek, endOfWeek, format } from "date-fns";

export function getCurrentWeekId(): string {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const year = weekStart.getFullYear();
  const weekNum = format(weekStart, "ww");
  return `${year}-W${weekNum}`;
}

export function getWeekRange(weekId: string): { start: Date; end: Date } {
  // weekId = "2025-W23"
  const [yearStr, weekStr] = weekId.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);

  // Get Jan 4th of that year (always in week 1)
  const jan4 = new Date(year, 0, 4);
  const jan4Week = startOfWeek(jan4, { weekStartsOn: 1 });
  const weekStart = new Date(jan4Week.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);

  return {
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  };
}

export function formatWeekLabel(weekId: string): string {
  const { start, end } = getWeekRange(weekId);
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function getLastNWeeks(n: number): string[] {
  const weeks: string[] = [];
  const now = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const year = weekStart.getFullYear();
    const weekNum = format(weekStart, "ww");
    weeks.unshift(`${year}-W${weekNum}`);
  }
  
  return weeks;
}