"use client";

import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Users, BookOpen, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.username || "Admin"}! Full system control & management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Users</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold">128</p>
          <span className="text-xs text-emerald-600">Active platform accounts</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Courses</span>
            <BookOpen className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">24</p>
          <span className="text-xs text-purple-600">Published & drafts</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Platform Activity</span>
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">98.4%</p>
          <span className="text-xs text-emerald-600">System health normal</span>
        </div>
      </div>
    </div>
  );
}
