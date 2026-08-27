import React from "react";
import { ShieldCheck, FileEdit, GraduationCap, UserCheck } from "lucide-react";

/**
 * Dynamic Role Badge for user authentication and management tables
 * @param {string} role - User role ("Admin" | "Content Manager" | "Instructor" | "Student")
 * @param {string} size - Size variant ("sm" | "md")
 * @param {string} className - Additional custom CSS
 */
export default function RoleBadge({ role = "Student", size = "sm", className = "" }) {
  const norm = String(role || "").toLowerCase().trim();

  let style = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  let label = role || "Student";
  let Icon = GraduationCap;

  if (norm.includes("admin")) {
    style = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    label = "Admin";
    Icon = ShieldCheck;
  } else if (norm.includes("manager") || norm.includes("content")) {
    style = "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    label = "Manager";
    Icon = FileEdit;
  } else if (norm.includes("instructor") || norm.includes("teacher")) {
    style = "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    label = "Instructor";
    Icon = UserCheck;
  } else {
    style = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    label = "Student";
    Icon = GraduationCap;
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
