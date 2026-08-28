"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import PageLoader from "@/components/common/PageLoader";
import {
  Newspaper,
  BookOpen,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  Layers
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const blogsRes = await fetchAPI("/blogs?populate=*&sort=createdAt:desc", { token });
        const blogList = Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [];
        setBlogs(blogList);

        const coursesRes = await fetchAPI("/courses?populate=*", { token });
        const courseList = Array.isArray(coursesRes?.data) ? coursesRes.data : Array.isArray(coursesRes) ? coursesRes : [];
        setCourses(courseList);
      } catch (err) {
        console.error("Failed to load Content Manager portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPortalData();
  }, [token]);

  if (loading) {
    return <PageLoader color="text-purple-600 dark:text-purple-400" message="Loading editorial studio..." />;
  }

  const publishedBlogs = blogs.filter((b) => !!b.publishedAt);
  const draftBlogs = blogs.filter((b) => !b.publishedAt);
  const publishedCourses = courses.filter((c) => c.isPublished !== false);
  const recentBlogs = blogs.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Portal Header */}
      <DashboardBanner
        eyebrow="Content Operations & Editorial Studio"
        title={`Welcome back, ${user?.username || "Content Manager"}! ✍️`}
        subtitle="Manage learning curriculum, publish insightful articles, and govern educational quality."
        actionText="Create Course Track"
        actionHref="/dashboard/manager/courses/new"
        actionIcon={PlusCircle}
        gradient="from-purple-950 via-purple-900 to-slate-900"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Course Catalog"
          value={courses.length}
          icon={BookOpen}
          color="indigo"
          subtitle={`${publishedCourses.length} published tracks`}
          href="/dashboard/manager/courses"
        />
        <StatCard
          title="Total Articles"
          value={blogs.length}
          icon={Newspaper}
          color="purple"
          subtitle={`${publishedBlogs.length} published, ${draftBlogs.length} drafts`}
          href="/dashboard/manager/blogs"
        />
        <StatCard
          title="Published Blogs"
          value={publishedBlogs.length}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Live on SkillFlow platform"
          href="/dashboard/manager/blogs"
        />
        <StatCard
          title="Editorial Drafts"
          value={draftBlogs.length}
          icon={Clock}
          color="amber"
          subtitle="Pending editorial review"
          href="/dashboard/manager/blogs"
        />
      </div>

      {/* Action Studio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Course & Curriculum Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Create new course tracks, edit video lectures and syllabus notes, manage quiz assessments, and review learner progress.
            </p>
          </div>
          <Link
            href="/dashboard/manager/courses"
            className="inline-flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition group"
          >
            <span>Manage Course Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Blog Publishing Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Create rich markdown articles, upload high-res cover photos via ImgBB, and toggle immediate publication or drafts.
            </p>
          </div>
          <Link
            href="/dashboard/manager/blogs"
            className="inline-flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition group"
          >
            <span>Open Blog Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-purple-500" /> Recent Articles
          </h2>
          <Link
            href="/dashboard/manager/blogs"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            View All Posts
          </Link>
        </div>

        {recentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBlogs.map((b) => (
              <div
                key={b.documentId || b.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
              >
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{b.title}</p>
                  <p className="text-[11px] text-slate-500">{b.category || "Tutorials"} • {b.readTime || "5 min read"}</p>
                </div>
                <StatusBadge status={b.publishedAt ? "Published" : "Draft"} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No articles created yet.</p>
        )}
      </div>
    </div>
  );
}