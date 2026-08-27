import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Reusable Dashboard Hero Gradient Banner
 * @param {string} eyebrow - Category / Portal subtitle tag
 * @param {string} title - Main header title
 * @param {string} subtitle - Explanatory caption
 * @param {string} actionText - Optional CTA button label
 * @param {string} actionHref - Optional CTA button link
 * @param {React.ReactNode} actionIcon - Optional Lucide icon for CTA button
 * @param {string} gradient - Tailwind gradient classes
 */
export default function DashboardBanner({
  eyebrow = "Workspace",
  title,
  subtitle,
  actionText,
  actionHref,
  actionIcon: ActionIcon,
  gradient = "from-indigo-950 via-indigo-900 to-slate-900",
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${gradient} text-white shadow-md`}
    >
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> {eyebrow}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs sm:text-sm text-indigo-200">{subtitle}</p>}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition shadow-sm w-fit"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
