"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import PageLoader from "@/components/common/PageLoader";
import {
  PlusCircle,
  BookOpen,
  Users,
  Layers,
  Edit3,
  BarChart3,
  ExternalLink,
  Trash2
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const loadInstructorCourses = async () => {
    if (!token) return;
    try {
      const res = await fetchAPI("/courses?populate=*", { token });
      const myCourses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setCourses(myCourses);
    } catch (err) {
      console.error("Failed to load instructor courses:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      loadInstructorCourses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [token, authLoading]);

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return;
    setDeleting(true);
    try {
      const targetId = deleteCourse.documentId || deleteCourse.id;
      await fetchAPI(`/courses/${targetId}`, {
        method: "DELETE",
        token,
      });
      setCourses((prev) => prev.filter((c) => (c.documentId || c.id) !== targetId));
      setDeleteCourse(null);
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert(err?.message || "Failed to delete course track.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <PageLoader color="text-teal-600 dark:text-teal-400" message="Loading instructor workspace..." />;
  }

  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);
  const totalQuizzes = courses.reduce((sum, c) => sum + (c.quizzes?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Dashboard Banner */}
      <DashboardBanner
        eyebrow="Instructor Studio"
        title="Instructor Dashboard 🎓"
        subtitle="Manage curricula, publish lectures, and monitor student engagement."
        actionText="Create New Track"
        actionHref="/dashboard/instructor/courses/new"
        actionIcon={PlusCircle}
        gradient="from-teal-950 via-slate-900 to-slate-900 border border-teal-900/40"
      />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Courses"
          value={courses.length}
          icon={BookOpen}
          color="teal"
          subtitle="Active authoring tracks"
        />
        <StatCard
          title="Total Lessons"
          value={totalLessons}
          icon={Layers}
          color="indigo"
          subtitle="Published lectures across tracks"
        />
        <StatCard
          title="Quizzes Built"
          value={totalQuizzes}
          icon={BarChart3}
          color="purple"
          subtitle="MCQ assessments active"
        />
      </div>

      {/* Course Authoring Tracks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Authoring Tracks ({courses.length})
          </h2>
          <Link
            href="/dashboard/instructor/courses/new"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            + Create Track
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const thumbnail =
                course.thumbnailUrl ||
                course.thumbnail?.url ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
              const cId = course.documentId || course.id;

              return (
                <div
                  key={cId}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                      <Image src={thumbnail} alt={course.title} fill className="object-cover" />
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white uppercase">
                        {course.level || "Beginner"}
                      </span>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={course.isPublished !== false ? "Published" : "Draft"} size="sm" />
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {course.category || "Web Development"}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>{course.lessons?.length || 0} Lessons</span>
                        <span>•</span>
                        <span>{course.quizzes?.length || 0} Quizzes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/dashboard/instructor/courses/${cId}/edit`}
                        className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Syllabus
                      </Link>
                      <Link
                        href={`/dashboard/instructor/courses/${cId}/progress`}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" /> Learners
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="text-[11px] text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview Public Course
                      </Link>

                      <button
                        onClick={() => setDeleteCourse(course)}
                        className="text-[11px] text-red-500 hover:text-red-400 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Courses Authored Yet"
            description="You have not created any courses yet. Get started by building your first curriculum track."
            actionText="Create New Track"
            actionHref="/dashboard/instructor/courses/new"
          />
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteCourse)}
        title="Delete Course Track?"
        message={`Are you sure you want to delete "${deleteCourse?.title}"? All associated lessons and quizzes will be removed.`}
        onClose={() => setDeleteCourse(null)}
        onConfirm={handleDeleteCourse}
        loading={deleting}
      />
    </div>
  );
}