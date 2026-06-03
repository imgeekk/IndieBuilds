import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StreakGraphProps {
  activeWeeks: string[];
  allWeeks: string[];
}

export default function StreakGraph({ activeWeeks, allWeeks }: StreakGraphProps) {
  return (
    <div className="flex items-center gap-1.5">
      {allWeeks.map((weekId) => {
        const isActive = activeWeeks.includes(weekId);
        return (
          <div
            key={weekId}
            title={weekId} // Simple tooltip showing the week ID
            className={cn(
              "w-4 h-4 rounded-sm transition-colors cursor-default",
              isActive 
                ? "bg-orange-400 border border-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]" 
                : "bg-zinc-300 border border-zinc-400"
            )}
          />
        );
      })}
    </div>
  );
}
