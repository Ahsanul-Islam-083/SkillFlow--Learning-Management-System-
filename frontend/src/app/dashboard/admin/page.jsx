"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import StatCard from "@/components/dashboard/StatCard";
import PageLoader from "@/components/common/PageLoader";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Newspaper,
  Layers,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [coursesRes, blogsRes] = await Promise.allSettled([
          fetchAPI("/courses?populate=*", { token }),
          fetchAPI("/blogs?populate=*", { token }),
        ]);

        if (coursesRes.status === "fulfilled") {
          const list = Array.isArray(coursesRes.value?.data) ? coursesRes.value.data : Array.isArray(coursesRes.value) ? coursesRes.value : [];
          setCourses(list);
        }

        if (blogsRes.status === "fulfilled") {
          const list = Array.isArray(blogsRes.value?.data) ? blogsRes.value.data : Array.isArray(blogsRes.value) ? blogsRes.value : [];
          setBlogs(list);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [token]);

  if (loading) {
    return <PageLoader color="text-amber-600 dark:text-amber-400" message="Loading administrative command center..." />;
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Banner */}
      <DashboardBanner
        eyebrow="System Administration & Governance"
        title={`Welcome back, ${user?.username || "Admin"}! 🛡️`}
        subtitle="Platform-wide operational oversight, role permissions, and content management."
        actionText="Manage Courses"
        actionHref="/dashboard/manager/courses"
        actionIcon={Layers}
        gradient="from-amber-950 via-slate-900 to-slate-900 border border-amber-900/40"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Platform Courses"
          value={courses.length}
          icon={BookOpen}
          color="indigo"
          subtitle="Curriculum tracks deployed"
          href="/dashboard/manager/courses"
        />
        <StatCard
          title="Published Articles"
          value={blogs.length}
          icon={Newspaper}
          color="purple"
          subtitle="Community articles"
          href="/dashboard/manager/blogs"
        />
        <StatCard
          title="System Governance"
          value="Online"
          icon={ShieldCheck}
          color="emerald"
          subtitle="Role policies active"
        />
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Course Catalog Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Review all published courses and drafts, inspect instructor lectures, and verify curriculum quality.
            </p>
          </div>
          <Link
            href="/dashboard/manager/courses"
            className="inline-flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition group"
          >
            <span>Open Course Control</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Editorial Blog Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Manage platform-wide publications, review manager drafts, and publish educational tech articles.
            </p>
          </div>
          <Link
            href="/dashboard/manager/blogs"
            className="inline-flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition group"
          >
            <span>Open Editorial Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
