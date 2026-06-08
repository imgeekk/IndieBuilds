import { startOfISOWeek, endOfISOWeek, addWeeks, format, getISOWeek, getISOWeekYear } from "date-fns";

export function getCurrentWeekId(): string {
  const now = new Date();
  return `${getISOWeekYear(now)}-W${String(getISOWeek(now)).padStart(2, "0")}`;
}

export function getWeekRange(weekId: string): { start: Date; end: Date } {
  const [yearStr, weekStr] = weekId.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);

  // Jan 4th is always in ISO week 1
  const jan4 = new Date(year, 0, 4);
  // Use addWeeks instead of raw ms arithmetic — safe across DST boundaries
  const weekStart = addWeeks(startOfISOWeek(jan4), week - 1);

  return {
    start: weekStart,
    end: endOfISOWeek(weekStart),
  };
}

export function formatWeekLabel(weekId: string): string {
  const { start, end } = getWeekRange(weekId);
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function getLastNWeeks(n: number): string[] {
  const weeks: string[] = [];
  const now = new Date();
  const currentWeekStart = startOfISOWeek(now);

  for (let i = 0; i < n; i++) {
    const weekStart = addWeeks(currentWeekStart, -i);
    weeks.unshift(`${getISOWeekYear(weekStart)}-W${String(getISOWeek(weekStart)).padStart(2, "0")}`);
  }

  return weeks;
}

export function getPrevWeekId(weekId: string): string {
  const { start } = getWeekRange(weekId);
  const prev = addWeeks(start, -1);
  return `${getISOWeekYear(prev)}-W${String(getISOWeek(prev)).padStart(2, "0")}`;
}

export function getNextWeekId(weekId: string): string {
  const { start } = getWeekRange(weekId);
  const next = addWeeks(start, 1);
  return `${getISOWeekYear(next)}-W${String(getISOWeek(next)).padStart(2, "0")}`;
}