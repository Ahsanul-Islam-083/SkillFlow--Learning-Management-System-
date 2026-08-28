import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Reusable Subpage Header with Back Navigation & Actions
 */
export default function SubpageHeader({
  backHref,
  eyebrow,
  title,
  actions,
  eyebrowColor = "text-indigo-600 dark:text-indigo-400",
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        <div>
          {eyebrow && (
            <span className={`text-xs font-bold uppercase tracking-wider ${eyebrowColor}`}>
              {eyebrow}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {actions && <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
