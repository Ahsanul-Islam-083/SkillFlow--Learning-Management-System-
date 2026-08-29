"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import PageLoader from "@/components/common/PageLoader";
import AlertBanner from "@/components/common/AlertBanner";
import AdminStatsOverview from "@/components/dashboard/admin/AdminStatsOverview";
import AdminUserTable from "@/components/dashboard/admin/AdminUserTable";
import AdminCourseTable from "@/components/dashboard/admin/AdminCourseTable";
import AdminBlogTable from "@/components/dashboard/admin/AdminBlogTable";
import EmptyState from "@/components/common/EmptyState";
import { Users, BookOpen, Newspaper, PlusCircle, Award, Search, RotateCcw, Filter } from "lucide-react";

const AdminDashboard = () => {
  const { user: currentAdmin, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);

  // 3 Dedicated Quiz Filters + Search State
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [quizFilter, setQuizFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all"); // "all" | "perfect" | "passed" | "failed"
  const [loading, setLoading] = useState(true);

  // Active View Tab: "users" | "courses" | "blogs" | "quizzes"
  const [activeTab, setActiveTab] = useState("users");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const loadAdminPlatformData = useCallback(async () => {
    try {
      const [usersRes, rolesRes, coursesRes, blogsRes, enrollmentsRes, quizRes] = await Promise.allSettled([
        fetchAPI("/users?populate=role", { token }),
        fetchAPI("/users-permissions/roles", { token }),
        fetchAPI("/courses?populate=*", { token }),
        fetchAPI("/blogs?status=draft&populate=*", { token }),
        fetchAPI("/enrollments?populate=*", { token }),
        fetchAPI("/quiz-submissions?populate[0]=student&populate[1]=quiz&populate[2]=quiz.course&sort=createdAt:desc", { token }),
      ]);

      if (usersRes.status === "fulfilled") {
        setUsers(Array.isArray(usersRes.value) ? usersRes.value : usersRes.value?.data || []);
      }
      if (rolesRes.status === "fulfilled") {
        setRoles(rolesRes.value?.roles || rolesRes.value || []);
      }
      if (coursesRes.status === "fulfilled") {
        setCourses(coursesRes.value?.data || coursesRes.value || []);
      }
      if (blogsRes.status === "fulfilled") {
        setBlogs(blogsRes.value?.data || blogsRes.value || []);
      }
      if (enrollmentsRes.status === "fulfilled") {
        setEnrollments(enrollmentsRes.value?.data || enrollmentsRes.value || []);
      }
      if (quizRes.status === "fulfilled") {
        setQuizSubmissions(Array.isArray(quizRes.value?.data) ? quizRes.value.data : Array.isArray(quizRes.value) ? quizRes.value : []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAdminPlatformData();
  }, [loadAdminPlatformData]);

  if (loading) {
    return (
      <PageLoader
        color="text-amber-600 dark:text-amber-400"
        message="Loading administrative command center..."
      />
    );
  }

  // Metrics Calculations
  const totalUsers = users.length;
  const adminsCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("admin")).length;
  const managersCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("manager")).length;
  const instructorsCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("instructor")).length;
  const studentsCount = totalUsers - adminsCount - managersCount - instructorsCount;

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

  // Filter Logic applying all 3 filters + search
  const filteredQuizSubmissions = quizSubmissions.filter((sub) => {
    const studentName = sub.student?.username || "";
    const studentEmail = sub.student?.email || "";
    const quizTitle = sub.quiz?.title || "";
    const courseTitle = sub.quiz?.course?.title || "";

    // 1. Text search
    const matchesSearch =
      studentName.toLowerCase().includes(quizSearchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(quizSearchTerm.toLowerCase()) ||
      quizTitle.toLowerCase().includes(quizSearchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(quizSearchTerm.toLowerCase());

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

  const hasActiveQuizFilters =
    quizSearchTerm !== "" || courseFilter !== "all" || quizFilter !== "all" || scoreFilter !== "all";

  const handleResetQuizFilters = () => {
    setQuizSearchTerm("");
    setCourseFilter("all");
    setQuizFilter("all");
    setScoreFilter("all");
  };

  return (
    <div className="space-y-8">
      {/* 1. Admin Hero Banner */}
      <DashboardBanner
        eyebrow="System Administration & Enterprise RBAC"
        title={`Welcome back, ${currentAdmin?.username || "Admin"}! 🛡️`}
        subtitle="Platform-wide operational control: Manage user roles, govern course curricula, oversee student quiz scores, and publish articles."
        actionText="Create Course Track"
        actionHref="/dashboard/manager/courses/new"
        actionIcon={PlusCircle}
        gradient="from-amber-950 via-slate-900 to-slate-900 border border-amber-900/40"
      />

      {/* 2. Platform Real Statistics & Breakdown */}
      <AdminStatsOverview
        totalUsers={totalUsers}
        totalEnrollments={enrollments.length}
        totalCourses={courses.length}
        totalBlogs={blogs.length}
        studentsCount={studentsCount}
        instructorsCount={instructorsCount}
        managersCount={managersCount}
        adminsCount={adminsCount}
      />

      <AlertBanner type={statusMessage.type} message={statusMessage.text} />

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "users"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Users className="w-4 h-4 flex-shrink-0" /> <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "courses"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" /> <span>Courses & Lessons ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "blogs"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Newspaper className="w-4 h-4 flex-shrink-0" /> <span>Blog Posts ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "quizzes"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Award className="w-4 h-4 flex-shrink-0" /> <span>Quiz Assessments ({quizSubmissions.length})</span>
        </button>
      </div>

      {/* 4. Tab Views */}
      {activeTab === "users" && (
        <AdminUserTable
          users={users}
          roles={roles}
          currentAdmin={currentAdmin}
          token={token}
          onUserUpdated={(userId, patch) => {
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
            setStatusMessage({ type: "success", text: "User updated successfully." });
          }}
          onUserDeleted={(userId) => {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setStatusMessage({ type: "success", text: "User account deleted." });
          }}
        />
      )}

      {activeTab === "courses" && (
        <AdminCourseTable
          courses={courses}
          token={token}
          onCourseDeleted={(courseId) => {
            setCourses((prev) => prev.filter((c) => (c.documentId || c.id) !== courseId));
            setStatusMessage({ type: "success", text: "Course track deleted." });
          }}
        />
      )}

      {activeTab === "blogs" && (
        <AdminBlogTable
          blogs={blogs}
          token={token}
          onBlogDeleted={(blogId) => {
            setBlogs((prev) => prev.filter((b) => (b.documentId || b.id) !== blogId));
            setStatusMessage({ type: "success", text: "Blog article deleted." });
          }}
        />
      )}

      {activeTab === "quizzes" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Platform-Wide Student Quiz Scores ({filteredQuizSubmissions.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-dimensional filtering by course track, quiz assessment, and score threshold.
              </p>
            </div>

            {/* 3 Dedicated Filters + Search Input */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter 1: Course Track */}
              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setQuizFilter("all"); // reset quiz filter on course change
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition cursor-pointer max-w-[170px] truncate"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map((c) => (
                  <option key={c.title} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>

              {/* Filter 2: Quiz Assessment */}
              <select
                value={quizFilter}
                onChange={(e) => setQuizFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition cursor-pointer max-w-[170px] truncate"
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
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition cursor-pointer"
              >
                <option value="all">All Scores</option>
                <option value="perfect">⭐ Perfect (100%)</option>
                <option value="passed">✅ Passed (60% - 100%)</option>
                <option value="failed">❌ Needs Retake (&lt; 60%)</option>
              </select>

              {/* Text Search */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={quizSearchTerm}
                  onChange={(e) => setQuizSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              {/* 1-Click Reset Button */}
              {hasActiveQuizFilters && (
                <button
                  onClick={handleResetQuizFilters}
                  title="Reset all filters"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {filteredQuizSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="pb-3 pl-3 pr-4">Student</th>
                    <th className="pb-3 px-4">Course Track</th>
                    <th className="pb-3 px-4">Quiz Title</th>
                    <th className="pb-3 px-4">Score</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 pr-3 text-right">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredQuizSubmissions.map((sub, idx) => {
                    const student = sub.student || {};
                    const isPassed = sub.isPassed || (sub.score || 0) >= 60;

                    return (
                      <tr key={sub.documentId || sub.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-4 pl-3 pr-4">
                          <p className="font-bold text-slate-900 dark:text-white">{student.username || "Learner"}</p>
                          <p className="text-[11px] text-slate-500">{student.email || "No email"}</p>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {sub.quiz?.course?.title || "Curriculum Track"}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {sub.quiz?.title || "Assessment"}
                        </td>
                        <td className="py-4 px-4 font-black text-sm text-amber-600 dark:text-amber-400">
                          {sub.score}%
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${isPassed
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800"
                              }`}
                          >
                            {isPassed ? "Passed" : "Needs Retake"}
                          </span>
                        </td>
                        <td className="py-4 pl-4 pr-3 text-right text-slate-500">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="No Matching Quiz Submissions"
              description="No submissions matched your combination of Course, Quiz, Score, and Search filters."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
