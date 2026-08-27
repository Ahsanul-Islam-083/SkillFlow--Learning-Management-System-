import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

/**
 * Reusable Empty State Box
 * @param {React.ReactNode} icon - Lucide icon
 * @param {string} title - Main header
 * @param {string} description - Explanatory subtitle
 * @param {string} actionText - Optional button label
 * @param {string} actionHref - Optional link for button
 * @param {Function} onActionClick - Optional onClick handler
 */
export default function EmptyState({
  icon: Icon = BookOpen,
  title = "No items found",
  description = "There are no records to display at this time.",
  actionText,
  actionHref,
  onActionClick,
}) {
  return (
    <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}

      {actionText && onActionClick && !actionHref && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
