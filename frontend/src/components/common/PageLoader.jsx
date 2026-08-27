import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Full-Page Loading Spinner
 */
export default function PageLoader({
  color = "text-indigo-600 dark:text-indigo-400",
  message,
  minHeight = "min-h-[70vh]",
}) {
  return (
    <div className={`${minHeight} flex flex-col items-center justify-center gap-3`}>
      <Loader2 className={`w-8 h-8 animate-spin ${color}`} />
      {message && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
