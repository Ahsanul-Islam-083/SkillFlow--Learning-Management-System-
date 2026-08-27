import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Reusable Feedback & Notification Banner
 * @param {string} type - "error" | "success"
 * @param {string} message - Feedback message
 */
export default function AlertBanner({ type = "error", message, className = "" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 border ${
        isSuccess
          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
          : "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
      } ${className}`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
      )}
      <span className="leading-relaxed font-medium">{message}</span>
    </div>
  );
}
