"use client";

import { useAuth } from "@/context/AuthContext";
import { BookOpen, Award, CheckCircle2, Clock } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.username || "Student"}! Continue your learning journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Enrolled Courses</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold">My Courses</p>
          <span className="text-xs text-slate-500">View your active enrollments</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Completed Lessons</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">Progress Track</p>
          <span className="text-xs text-emerald-600">Track finished topics</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Quiz Scores</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">Certificates</p>
          <span className="text-xs text-slate-500">View assessment results</span>
        </div>
      </div>
    </div>
  );
}
