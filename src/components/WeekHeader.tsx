import Link from "next/link";
import { formatWeekLabel, getCurrentWeekId } from "../lib/week";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  weekId: string;
  prevWeekId: string | null;
  nextWeekId: string | null;
  launchCount: number;
};

export default function WeekHeader({ weekId, prevWeekId, nextWeekId, launchCount }: Props) {
  const isCurrentWeek = weekId === getCurrentWeekId();

  return (
    <div className="flex items-center justify-between mb-6 text-secondary">
      <div>
        <h2 className="text-lg font-[inter-semibold]">
          {isCurrentWeek ? "This week's launches" : `Week of ${formatWeekLabel(weekId)}`}
        </h2>
        <p className="text-sm text-muted mt-0.5">
          {launchCount} {launchCount === 1 ? "builder" : "builders"} shipped
        </p>
      </div>

      <div className="flex items-center gap-1">
        {prevWeekId && (
          <Link
            href={`/week/${prevWeekId}`}
            className="p-1.5 rounded-xs border border-card-border text-muted hover:text-foreground hover:border-zinc-500 transition-colors"
          >
            <FaChevronLeft size={16} />
          </Link>
        )}
        {nextWeekId && (
          <Link
            href={`/week/${nextWeekId}`}
            className="p-1.5 rounded-xs border border-card-border text-muted hover:text-foreground hover:border-zinc-500 transition-colors"
          >
            <FaChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

// needed because this is a server component
function getCurrentWeekIdStatic(): string {
  const { startOfWeek, format } = require("date-fns");
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  return `${weekStart.getFullYear()}-W${format(weekStart, "ww")}`;
}