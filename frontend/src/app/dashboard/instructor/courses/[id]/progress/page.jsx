"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import SubpageHeader from "@/components/dashboard/SubpageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import ProgressBar from "@/components/common/ProgressBar";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Search,
  FileQuestion,
  RotateCcw
} from "lucide-react";

export default function CourseProgressPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("learners"); // "learners" | "quizzes"

  // 2 Specific Quiz Filters + Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [quizFilter, setQuizFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all"); // "all" | "perfect" | "passed" | "failed"

  useEffect(() => {
    async function loadCourseAndLearners() {
      if (!id) return;
      try {
        const isNumeric = /^\d+$/.test(id);
        const filterQuery = isNumeric
          ? `/courses?filters[$or][0][id][$eq]=${id}&filters[$or][1][documentId][$eq]=${id}&filters[$or][2][slug][$eq]=${id}&populate=*`
          : `/courses?filters[$or][0][documentId][$eq]=${id}&filters[$or][1][slug][$eq]=${id}&populate=*`;

        let courseData = null;
        try {
          const res = await fetchAPI(filterQuery);
          const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          if (list.length > 0) courseData = list[0];
        } catch (filterErr) {
          console.warn("Filtered course query failed:", filterErr);
        }

        if (!courseData) {
          const singleRes = await fetchAPI(`/courses/${id}?populate=*`);
          courseData = singleRes?.data || singleRes;
        }

        if (courseData) {
          setCourse(courseData);
          const courseDocId = courseData.documentId || courseData.id;

          // Fetch Enrollments & Quiz Submissions for this specific course in parallel
          const [enrollRes, quizRes] = await Promise.allSettled([
            fetchAPI(
              `/enrollments?filters[course][documentId][$eq]=${courseDocId}&populate[0]=student&populate[1]=completedLessons`,
              { token }
            ),
            fetchAPI(
              `/quiz-submissions?populate[0]=student&populate[1]=quiz&populate[2]=quiz.course&sort=createdAt:desc`,
              { token }
            ),
          ]);

          if (enrollRes.status === "fulfilled") {
            let enrollList = Array.isArray(enrollRes.value?.data)
              ? enrollRes.value.data
              : Array.isArray(enrollRes.value)
                ? enrollRes.value
                : [];

            if (enrollList.length === 0 && courseData.id) {
              try {
                const fallbackRes = await fetchAPI(
                  `/enrollments?filters[course][id][$eq]=${courseData.id}&populate[0]=student&populate[1]=completedLessons`,
                  { token }
                );
                enrollList = Array.isArray(fallbackRes?.data) ? fallbackRes.data : Array.isArray(fallbackRes) ? fallbackRes : [];
              } catch (e) {
                console.warn("Fallback enrollment fetch failed:", e);
              }
            }
            setEnrollments(enrollList);
          }

          if (quizRes.status === "fulfilled") {
            const allSubs = Array.isArray(quizRes.value?.data)
              ? quizRes.value.data
              : Array.isArray(quizRes.value)
                ? quizRes.value
                : [];

            // Filter submissions strictly belonging to this course
            const validCourseQuizIds = new Set(
              (courseData.quizzes || []).flatMap((q) => [String(q.id), String(q.documentId)].filter(Boolean))
            );

            const courseSubs = allSubs.filter((s) => {
              const quizRef = s.quiz;
              if (!quizRef) return false;
              const matchesQuizId =
                validCourseQuizIds.has(String(quizRef.id)) ||
                validCourseQuizIds.has(String(quizRef.documentId));
              const matchesCourseId =
                quizRef.course?.id === courseData.id ||
                quizRef.course?.documentId === courseData.documentId;
              return matchesQuizId || matchesCourseId;
            });

            setQuizSubmissions(courseSubs);
          }
        }
      } catch (err) {
        console.error("Failed to load progress details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourseAndLearners();
  }, [id, token]);

  if (loading) {
    return <PageLoader color="text-teal-600 dark:text-teal-400" message="Loading learner progress..." />;
  }

  const totalStudents = enrollments.length;
  const completedStudents = enrollments.filter((e) => e.isCompleted || (e.progress || 0) >= 100).length;
  const inProgressStudents = totalStudents - completedStudents;
  const totalLessonsCount = course?.lessons?.length || 0;

  // Quizzes defined strictly under this course
  const courseQuizzes = course?.quizzes || [];

  // Filtered Learners
  const filteredEnrollments = enrollments.filter((e) => {
    const username = e.student?.username || "";
    const email = e.student?.email || "";
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filtered Quiz Submissions (using Quiz Title + Score + Search)
  const filteredQuizSubmissions = quizSubmissions.filter((s) => {
    const username = s.student?.username || "";
    const email = s.student?.email || "";
    const quizTitle = s.quiz?.title || "";

    // 1. Student search
    const matchesSearch =
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Quiz Filter (matches quizzes of this course)
    const matchesQuiz =
      quizFilter === "all" ||
      quizTitle.toLowerCase() === quizFilter.toLowerCase() ||
      String(s.quiz?.id) === String(quizFilter) ||
      String(s.quiz?.documentId) === String(quizFilter);

    // 3. Score Filter
    const score = s.score ?? 0;
    let matchesScore = true;
    if (scoreFilter === "perfect") matchesScore = score === 100;
    else if (scoreFilter === "passed") matchesScore = score >= 60;
    else if (scoreFilter === "failed") matchesScore = score < 60;

    return matchesSearch && matchesQuiz && matchesScore;
  });

  const hasActiveFilters = searchTerm !== "" || quizFilter !== "all" || scoreFilter !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setQuizFilter("all");
    setScoreFilter("all");
  };

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Course Header */}
        <SubpageHeader
          backHref="/dashboard/instructor"
          eyebrow="Student Performance Analytics"
          eyebrowColor="text-teal-600 dark:text-teal-400"
          title={course?.title || "Course Track"}
          actions={
            <Link
              href={`/dashboard/instructor/courses/${course?.documentId || course?.id || id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm w-fit"
            >
              <BookOpen className="w-4 h-4" /> Edit Curriculum
            </Link>
          }
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Enrolled Learners" value={totalStudents} icon={Users} color="teal" subtitle="Active students in course" />
          <StatCard title="Completed Course" value={completedStudents} icon={Award} color="emerald" subtitle={`${completedStudents} certificate eligible`} />
          <StatCard title="In Progress" value={inProgressStudents} icon={Clock} color="indigo" subtitle="Currently learning curriculum" />
          <StatCard title="Quiz Attempts" value={quizSubmissions.length} icon={FileQuestion} color="purple" subtitle="Total quizzes submitted" />
        </div>

        {/* View Switcher Tabs & Filter Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tab Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("learners")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === "learners"
                    ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <Users className="w-4 h-4" /> Enrolled Learners ({enrollments.length})
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === "quizzes"
                    ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <Award className="w-4 h-4" /> Quiz Results ({quizSubmissions.length})
              </button>
            </div>

            {/* Filter Controls (2 Filters for Quizzes + Search) */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {activeTab === "quizzes" && (
                <>
                  {/* Filter 1: Quiz Title Filter (Only Quizzes of this course) */}
                  <select
                    value={quizFilter}
                    onChange={(e) => setQuizFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer max-w-[180px] truncate"
                  >
                    <option value="all">All Course Quizzes</option>
                    {courseQuizzes.map((q) => (
                      <option key={q.id || q.documentId || q.title} value={q.title}>
                        {q.title}
                      </option>
                    ))}
                  </select>

                  {/* Filter 2: Score Percentage Filter */}
                  <select
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer"
                  >
                    <option value="all">All Scores</option>
                    <option value="perfect">⭐ Perfect (100%)</option>
                    <option value="passed">✅ Passed (60% - 100%)</option>
                    <option value="failed">❌ Needs Retake (&lt; 60%)</option>
                  </select>
                </>
              )}

              {/* Text Search */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  title="Reset filters"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: Enrolled Learners Progress Table */}
          {activeTab === "learners" && (
            <div>
              {filteredEnrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                      <tr>
                        <th className="pb-3 pl-3 pr-4 min-w-[200px] whitespace-nowrap">Learner</th>
                        <th className="pb-3 px-4 min-w-[120px] whitespace-nowrap">Status</th>
                        <th className="pb-3 px-4 min-w-[130px] whitespace-nowrap">Lectures Done</th>
                        <th className="pb-3 px-4 min-w-[160px] whitespace-nowrap">Progress Bar</th>
                        <th className="pb-3 pl-4 pr-3 text-right min-w-[110px] whitespace-nowrap">Completion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredEnrollments.map((enrollment, idx) => {
                        const student = enrollment.student || {};
                        const progress = enrollment.progress || 0;
                        const isCompleted = enrollment.isCompleted || progress >= 100;
                        const completedCount = enrollment.completedLessons?.length || 0;

                        return (
                          <tr key={enrollment.documentId || enrollment.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="py-4 pl-3 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {student.username ? student.username.slice(0, 2).toUpperCase() : "ST"}
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-bold text-slate-900 dark:text-white truncate">{student.username || "Enrolled Student"}</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{student.email || "No email linked"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <StatusBadge status={isCompleted ? "Completed" : "In Progress"} size="sm" />
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                              {completedCount} of {totalLessonsCount} lectures
                            </td>
                            <td className="py-4 px-4 min-w-[160px]">
                              <ProgressBar progress={progress} isCompleted={isCompleted} color="teal" />
                            </td>
                            <td className="py-4 pl-4 pr-3 text-right whitespace-nowrap font-black text-slate-900 dark:text-white">
                              {progress}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No Enrolled Learners Found"
                  description="Students who enroll in this track will automatically appear here."
                />
              )}
            </div>
          )}

          {/* TAB 2: Student Quiz Assessment Results */}
          {activeTab === "quizzes" && (
            <div>
              {filteredQuizSubmissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                      <tr>
                        <th className="pb-3 pl-3 pr-4 min-w-[200px] whitespace-nowrap">Student</th>
                        <th className="pb-3 px-4 min-w-[180px] whitespace-nowrap">Quiz Assessment</th>
                        <th className="pb-3 px-4 min-w-[110px] whitespace-nowrap">Score</th>
                        <th className="pb-3 px-4 min-w-[120px] whitespace-nowrap">Evaluation</th>
                        <th className="pb-3 pl-4 pr-3 text-right min-w-[130px] whitespace-nowrap">Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredQuizSubmissions.map((sub, idx) => {
                        const student = sub.student || {};
                        const isPassed = sub.isPassed || (sub.score || 0) >= 60;

                        return (
                          <tr key={sub.documentId || sub.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="py-4 pl-3 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {student.username ? student.username.slice(0, 2).toUpperCase() : "ST"}
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-bold text-slate-900 dark:text-white truncate">{student.username || "Student"}</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{student.email || "No email"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                              {sub.quiz?.title || "Course Quiz"}
                            </td>
                            <td className="py-4 px-4 font-black text-sm text-teal-600 dark:text-teal-400">
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
                            <td className="py-4 pl-4 pr-3 text-right text-slate-500 dark:text-slate-400">
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
                  title="No Matching Quiz Attempts Found"
                  description="No attempts matched your combination of Quiz, Score, and Search filters."
                />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
