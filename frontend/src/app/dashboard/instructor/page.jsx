"use client";

import { useAuth } from "@/context/AuthContext";
import { GraduationCap, BookOpen, Users, HelpCircle } from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-100 dark:bg-teal-950/50 text-teal-600 rounded-xl">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.username || "Instructor"}! Manage your courses, lessons, and quizzes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">My Courses</span>
            <BookOpen className="w-5 h-5 text-teal-500" />
          </div>
          <p className="text-2xl font-bold">Manage Lessons</p>
          <span className="text-xs text-slate-500">Add video lessons & resources</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Quizzes</span>
            <HelpCircle className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold">Course Quizzes</p>
          <span className="text-xs text-slate-500">Create & manage assessments</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Enrolled Students</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">Track Progress</p>
          <span className="text-xs text-emerald-600">View completion stats</span>
        </div>
      </div>
    </div>
  );
}
