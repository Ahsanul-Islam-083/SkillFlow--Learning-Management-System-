"use client";

import { useAuth } from "@/context/AuthContext";
import { FileEdit, BookOpen, Layers, Newspaper } from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 dark:bg-purple-950/50 text-purple-600 rounded-xl">
          <FileEdit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Manager Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.username || "Manager"}! Manage platform content, courses, and blogs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Course Library</span>
            <BookOpen className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">Manage Courses</p>
          <span className="text-xs text-slate-500">Create, edit, and publish curriculum</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Blog Posts</span>
            <Newspaper className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold">Articles & News</p>
          <span className="text-xs text-slate-500">Draft and publish blog content</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Curriculum Review</span>
            <Layers className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">Content Quality</p>
          <span className="text-xs text-emerald-600">All content up-to-date</span>
        </div>
      </div>
    </div>
  );
}
