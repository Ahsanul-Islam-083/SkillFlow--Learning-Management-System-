"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Award,
  TrendingUp
} from "lucide-react";

export default function StudentDashboard() {
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
        const res = await fetchAPI(
          `/enrollments?filters[student][id][$eq]=${user.id}&populate[0]=course&populate[1]=course.lessons&populate[2]=completedLessons`,
          { token }
        );

        const enrollments = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

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
    return <PageLoader color="text-indigo-600 dark:text-indigo-400" message="Loading your enrolled courses..." />;
  }

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
    <div className="space-y-8">
      {/* Dashboard Banner */}
      <DashboardBanner
        eyebrow="Student Learning Workspace"
        title={`Welcome back, ${user?.username || "Learner"}! 👋`}
        subtitle="Continue your curriculum tracks and pick up right where you left off."
        actionText="Browse Full Catalog"
        actionHref="/#courses"
        actionIcon={BookOpen}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Courses"
          value={totalEnrolled}
          icon={BookOpen}
          color="indigo"
          subtitle="Active enrolled tracks"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={TrendingUp}
          color="teal"
          subtitle="Currently learning"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Completed tracks"
        />
        <StatCard
          title="Avg Completion"
          value={`${avgCompletion}%`}
          icon={Award}
          color="purple"
          subtitle="Platform progress rate"
        />
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Enrolled Tracks ({enrolledCourses.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tracks you are currently enrolled in
          </p>
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

                    {/* Course Info */}
                    <div className="p-6 space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {course.category || "Web Development"}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>

                      {/* Progress Bar Component */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <ProgressBar
                          progress={course.progress}
                          isCompleted={course.isCompleted}
                          showLabel
                          subLabel={`${course.completedCount} of ${course.totalLessons} lessons`}
                          color="indigo"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/courses/${course.slug}/learn`}
                      className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                        course.isCompleted
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
          <EmptyState
            icon={BookOpen}
            title="No Enrolled Courses Found"
            description="You have not enrolled in any learning tracks yet. Browse the course catalog to choose a track and start learning."
            actionText="Browse Course Catalog"
            actionHref="/#courses"
          />
        )}
      </div>
    </div>
  );
}
