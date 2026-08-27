import React from "react";

/**
 * Reusable Progress Bar Component
 * @param {number} progress - Percentage between 0 and 100
 * @param {boolean} isCompleted - Whether progress is 100% completed
 * @param {boolean} showLabel - Whether to display percentage text
 * @param {string} subLabel - Optional description text
 * @param {string} color - "indigo" | "teal" | "purple" | "emerald"
 * @param {string} size - "sm" | "md" | "lg"
 */
export default function ProgressBar({
  progress = 0,
  isCompleted = false,
  showLabel = false,
  subLabel,
  color = "indigo",
  size = "md",
}) {
  const clamped = Math.min(Math.max(Number(progress) || 0, 0), 100);
  const isDone = isCompleted || clamped >= 100;

  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  const colorMap = {
    indigo: isDone ? "bg-emerald-500" : "bg-indigo-600 dark:bg-indigo-500",
    teal: isDone ? "bg-emerald-500" : "bg-teal-500",
    purple: isDone ? "bg-emerald-500" : "bg-purple-600 dark:bg-purple-500",
    emerald: "bg-emerald-500",
  };

  return (
    <div className="space-y-1.5 w-full">
      {(showLabel || subLabel) && (
        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          {subLabel && <span>{subLabel}</span>}
          {showLabel && <span className="font-bold text-slate-900 dark:text-white">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full ${heightClass} rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || colorMap.indigo}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
