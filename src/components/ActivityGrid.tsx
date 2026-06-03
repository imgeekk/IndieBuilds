import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ActivityGridProps {
  activeWeeks: string[];
  allWeeks: string[];
}

export default function ActivityGrid({ activeWeeks, allWeeks }: ActivityGridProps) {
  return (
    <div className="flex items-start gap-1.5">
      {allWeeks.map((weekId) => {
        const isActive = activeWeeks.includes(weekId);
        // Extract the "Wxx" part from "2026-W23"
        const weekLabel = weekId.split("-")[1] || weekId;

        return (
          <div key={weekId} className="flex flex-col items-center gap-1">
            <div
              title={weekId}
              className={cn(
                "w-4 h-4 rounded-sm transition-colors cursor-default",
                isActive 
                  ? "bg-purple-400 border border-purple-500 shadow-[0_0_8px_rgba(192,132,252,0.4)]" 
                  : "bg-card border border-card-border"
              )}
            />
            <span className="text-[9px] text-muted font-mono leading-none">
              {weekLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
