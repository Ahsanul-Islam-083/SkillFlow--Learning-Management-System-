"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import StatusBadge from "@/components/common/StatusBadge";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Award,
  TrendingUp,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentEnrollments() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Query Strapi for enrollments specific to this logged-in student
        const res = await fetchAPI(
          `/enrollments?filters[student][id][$eq]=${user.id}&populate[0]=course&populate[1]=course.lessons&populate[2]=completedLessons`,
          { token }
        );

        const enrollments = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        // Map and extract course details along with persistent Strapi progress
        const validCourses = enrollments
          .filter((item) => item.course != null)
          .map((item) => {
            const courseData = item.course;
            const progress = typeof item.progress === "number" ? item.progress : 0;
            const isCompleted = item.isCompleted || progress >= 100;
            const completedCount = item.completedLessons?.length || 0;
            const totalLessons = courseData.lessons?.length || 0;

            return {
              ...courseData,
              enrollmentId: item.documentId || item.id,
              progress,
              isCompleted,
              completedCount,
              totalLessons,
            };
          });

        setEnrolledCourses(validCourses);
      } catch (err) {
        console.error("Failed to load student enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStudentEnrollments();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  // Calculate dynamic metrics
  const totalEnrolled = enrolledCourses.length;
  const completedCount = enrolledCourses.filter((c) => c.isCompleted).length;
  const inProgressCount = totalEnrolled - completedCount;
  const avgCompletion =
    totalEnrolled > 0
      ? Math.round(
        enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrolled
      )
      : 0;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Student Learning Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.username || "Learner"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Continue your curriculum tracks and pick up right where you left off.
            </p>
          </div>
          <Link
            href="/#courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition shadow-sm w-fit"
          >
            <BookOpen className="w-4 h-4" /> Browse Full Catalog
          </Link>
        </div>

        {/* Real-time Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                My Courses
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {totalEnrolled}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                In Progress
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {inProgressCount}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Completed
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {completedCount}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Avg Completion
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {avgCompletion}%
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Enrolled Tracks ({enrolledCourses.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tracks you are currently enrolled in
              </p>
            </div>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => {
                const thumbnail =
                  course.thumbnailUrl ||
                  course.thumbnail?.url ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

                return (
                  <div
                    key={course.enrollmentId || course.slug || course.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white uppercase tracking-wider">
                            {course.level || "Beginner"}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <StatusBadge
                            status={course.isCompleted ? "Completed" : "In Progress"}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Course Information */}
                      <div className="p-6 space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {course.category || "Web Development"}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {course.title}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span>
                              {course.completedCount} of {course.totalLessons} lessons
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${course.isCompleted
                                  ? "bg-emerald-500"
                                  : "bg-indigo-600 dark:bg-indigo-500"
                                }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-6 pt-0">
                      <Link
                        href={`/courses/${course.slug}/learn`}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${course.isCompleted
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                          }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>
                          {course.isCompleted
                            ? "Review Curriculum"
                            : course.progress > 0
                              ? "Resume Learning"
                              : "Start Course"}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when student has 0 enrollments */
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Enrolled Courses Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  You have not enrolled in any learning tracks yet. Browse the course catalog to choose a track and start learning.
                </p>
              </div>
              <Link
                href="/#courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
