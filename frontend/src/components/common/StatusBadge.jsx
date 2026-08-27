import React from "react";
import { CheckCircle2, Clock, FileText, Check, AlertCircle } from "lucide-react";

/**
 * Unified Status Badge component for courses, blogs, and learning progress
 * @param {string} status - Current status string ("Published" | "Draft" | "In Progress" | "Completed" | "Pending")
 * @param {string} size - Size variant ("sm" | "md")
 * @param {string} className - Additional CSS classes
 */
export default function StatusBadge({ status = "Draft", size = "sm", className = "" }) {
  const normalized = String(status || "").toLowerCase().trim();

  let style = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  let label = status;
  let Icon = FileText;

  if (normalized === "published" || normalized === "active") {
    style = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80";
    label = "Published";
    Icon = CheckCircle2;
  } else if (normalized === "draft" || normalized === "inactive") {
    style = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/80";
    label = "Draft";
    Icon = FileText;
  } else if (normalized === "completed" || normalized === "passed") {
    style = "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800/80";
    label = "Completed";
    Icon = Check;
  } else if (normalized === "in progress" || normalized === "learning" || normalized === "pending") {
    style = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80";
    label = "In Progress";
    Icon = Clock;
  }

  const sizeClasses = size === "md" ? "text-xs px-3 py-1 gap-1.5" : "text-[11px] px-2.5 py-0.5 gap-1";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${style} ${sizeClasses} ${className}`}
    >
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} />
      <span>{label}</span>
    </span>
  );
}
