"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import {
  FileEdit,
  Newspaper,
  BookOpen,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        // Fetch all blogs
        const blogsRes = await fetchAPI("/blogs?populate=*&sort=createdAt:desc", { token });
        const blogList = Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [];
        setBlogs(blogList);

        // Fetch all courses
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
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  const publishedBlogs = blogs.filter((b) => !!b.publishedAt);
  const draftBlogs = blogs.filter((b) => !b.publishedAt);
  const publishedCourses = courses.filter((c) => c.isPublished !== false);

  const recentBlogs = blogs.slice(0, 5);

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Content Operations & Editorial Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.username || "Content Manager"}! ✍️
            </h1>
            <p className="text-xs sm:text-sm text-purple-200">
              Manage learning curriculum, publish insightful articles, and govern educational quality.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/manager/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Manage & Author Blogs
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            title="Course Catalog"
            value={courses.length}
            icon={BookOpen}
            color="indigo"
            subtitle={`${publishedCourses.length} published tracks`}
            href="/#courses"
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

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Curriculum & Quality Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Inspect public course tracks, audit syllabus lecture structures, and review MCQ assessment quality across all categories.
              </p>
            </div>
            <Link
              href="/#courses"
              className="inline-flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition group"
            >
              <span>Explore Public Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Recent Articles Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-500" />
                Recent Editorial Articles
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overview of latest created and published articles
              </p>
            </div>

            <Link
              href="/dashboard/manager/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBlogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="pb-3 pl-2">Article</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Author</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Published</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentBlogs.map((blog) => {
                    const cover =
                      blog.coverImageUrl ||
                      blog.coverImage?.url ||
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";
                    const isPub = !!blog.publishedAt;

                    return (
                      <tr
                        key={blog.documentId || blog.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                      >
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                              <Image src={cover} alt={blog.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 max-w-sm">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {blog.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {blog.excerpt || "No excerpt provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {blog.category || "Tutorials"}
                        </td>
                        <td className="py-4 text-slate-600 dark:text-slate-400">
                          {blog.author?.username || user?.username || "Editorial Team"}
                        </td>
                        <td className="py-4">
                          <StatusBadge status={isPub ? "Published" : "Draft"} />
                        </td>
                        <td className="py-4 pr-2 text-right text-slate-500 dark:text-slate-400 font-medium">
                          {isPub ? new Date(blog.publishedAt).toLocaleDateString() : "Unpublished Draft"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                No articles created yet
              </p>
              <Link
                href="/dashboard/manager/blogs"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Write First Article
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
