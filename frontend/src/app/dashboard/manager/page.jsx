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
  Layers,
  Award,
  Search,
  RotateCcw
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);

  // 3 Dedicated Quiz Filters + Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [quizFilter, setQuizFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all"); // "all" | "perfect" | "passed" | "failed"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [blogsRes, coursesRes, quizRes] = await Promise.allSettled([
          fetchAPI("/blogs?status=draft&populate=*&sort=createdAt:desc", { token }),
          fetchAPI("/courses?populate=*", { token }),
          fetchAPI("/quiz-submissions?populate[0]=student&populate[1]=quiz&populate[2]=quiz.course&sort=createdAt:desc", { token }),
        ]);

        if (blogsRes.status === "fulfilled") {
          const blogList = Array.isArray(blogsRes.value?.data) ? blogsRes.value.data : Array.isArray(blogsRes.value) ? blogsRes.value : [];
          setBlogs(blogList);
        }

        if (coursesRes.status === "fulfilled") {
          const courseList = Array.isArray(coursesRes.value?.data) ? coursesRes.value.data : Array.isArray(coursesRes.value) ? coursesRes.value : [];
          setCourses(courseList);
        }

        if (quizRes.status === "fulfilled") {
          const quizList = Array.isArray(quizRes.value?.data) ? quizRes.value.data : Array.isArray(quizRes.value) ? quizRes.value : [];
          setQuizSubmissions(quizList);
        }
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

  // Derive unique courses for course dropdown
  const uniqueCourses = Array.from(
    new Map(
      quizSubmissions
        .map((s) => s.quiz?.course)
        .filter(Boolean)
        .map((c) => [c.title, c])
    ).values()
  );

  // Derive unique quizzes (dynamically filtered if a course is chosen)
  const uniqueQuizzes = Array.from(
    new Map(
      quizSubmissions
        .filter((s) => courseFilter === "all" || s.quiz?.course?.title === courseFilter)
        .map((s) => s.quiz)
        .filter(Boolean)
        .map((q) => [q.title, q])
    ).values()
  );

  // Filtered Quiz Submissions
  const filteredQuizSubmissions = quizSubmissions.filter((sub) => {
    const studentName = sub.student?.username || "";
    const quizTitle = sub.quiz?.title || "";
    const courseTitle = sub.quiz?.course?.title || "";

    // 1. Text Search
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Course Filter
    const matchesCourse = courseFilter === "all" || courseTitle === courseFilter;

    // 3. Quiz Filter
    const matchesQuiz = quizFilter === "all" || quizTitle === quizFilter;

    // 4. Score Filter
    const score = sub.score ?? 0;
    let matchesScore = true;
    if (scoreFilter === "perfect") matchesScore = score === 100;
    else if (scoreFilter === "passed") matchesScore = score >= 60;
    else if (scoreFilter === "failed") matchesScore = score < 60;

    return matchesSearch && matchesCourse && matchesQuiz && matchesScore;
  });

  const hasActiveFilters =
    searchTerm !== "" || courseFilter !== "all" || quizFilter !== "all" || scoreFilter !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setCourseFilter("all");
    setQuizFilter("all");
    setScoreFilter("all");
  };

  return (
    <div className="space-y-8">
      {/* Portal Header */}
      <DashboardBanner
        eyebrow="Content Operations & Editorial Studio"
        title={`Welcome back, ${user?.username || "Content Manager"}! ✍️`}
        subtitle="Manage learning curriculum, review student quiz submissions, and publish quality editorial articles."
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
          title="Quiz Submissions"
          value={quizSubmissions.length}
          icon={Award}
          color="emerald"
          subtitle="Platform assessment attempts"
        />
        <StatCard
          title="Editorial Drafts"
          value={draftBlogs.length}
          icon={Clock}
          color="amber"
          subtitle="Pending publication"
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

      {/* Student Quiz Assessments Review Table with 3 Filters */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" /> Platform Student Quiz Assessments ({filteredQuizSubmissions.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live inspection of student exam grades and curriculum comprehension.
            </p>
          </div>

          {/* 3 Filters & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter 1: Course */}
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setQuizFilter("all");
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map((c) => (
                <option key={c.title} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Filter 2: Quiz */}
            <select
              value={quizFilter}
              onChange={(e) => setQuizFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Quizzes</option>
              {uniqueQuizzes.map((q) => (
                <option key={q.title} value={q.title}>
                  {q.title}
                </option>
              ))}
            </select>

            {/* Filter 3: Score Range */}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
            >
              <option value="all">All Scores</option>
              <option value="perfect">⭐ Perfect (100%)</option>
              <option value="passed">✅ Passed (60% - 100%)</option>
              <option value="failed">❌ Needs Retake (&lt; 60%)</option>
            </select>

            {/* Text Search */}
            <div className="relative w-full sm:w-52">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                title="Reset all filters"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredQuizSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3 pl-3 pr-4">Student</th>
                  <th className="pb-3 px-4">Course</th>
                  <th className="pb-3 px-4">Quiz Title</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 pr-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuizSubmissions.map((sub, idx) => {
                  const student = sub.student || {};
                  const isPassed = sub.isPassed || (sub.score || 0) >= 60;

                  return (
                    <tr key={sub.documentId || sub.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pl-3 pr-4 font-bold text-slate-900 dark:text-white">
                        {student.username || "Learner"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {sub.quiz?.course?.title || "Course"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {sub.quiz?.title || "Assessment"}
                      </td>
                      <td className="py-3.5 px-4 font-black text-sm text-purple-600 dark:text-purple-400">
                        {sub.score}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isPassed
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800"
                            }`}
                        >
                          {isPassed ? "Passed" : "Needs Retake"}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 pr-3 text-right text-slate-400">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No student quiz attempts matched the filter criteria.</p>
        )}
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
