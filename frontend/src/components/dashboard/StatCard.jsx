import React from "react";
import Link from "next/link";

/**
 * Reusable Metric & Analytics Counter Card
 * @param {string} title - Card header label
 * @param {string|number} value - Main numerical stat or value
 * @param {React.ReactNode} icon - Lucide icon component
 * @param {string} color - Color theme ("indigo" | "purple" | "teal" | "amber" | "emerald" | "rose")
 * @param {string} subtitle - Explanatory caption or trend note
 * @param {string} trend - Optional trend percentage (e.g. "+12%")
 * @param {string} href - Optional link to wrap the card
 */
const colorStyles = {
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  purple: {
    iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-purple-600 dark:text-purple-400",
  },
  teal: {
    iconBg: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-teal-600 dark:text-teal-400",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-amber-600 dark:text-amber-400",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
    border: "border-slate-200 dark:border-slate-800",
    accent: "text-rose-600 dark:text-rose-400",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "indigo",
  subtitle,
  trend,
  href,
}) {
  const theme = colorStyles[color] || colorStyles.indigo;

  const content = (
    <div
      className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${theme.border} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-3 rounded-2xl ${theme.iconBg} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value ?? "0"}
          </p>
          {trend && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full group">
        {content}
      </Link>
    );
  }

  return content;
}
