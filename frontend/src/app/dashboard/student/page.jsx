"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Award,
  TrendingUp,
  Loader2
} from "lucide-react";

const StudentDashboard = () => {

  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    async function loadStudentCourses() {
      try {
        const res = await fetchAPI("/courses?populate=*");
        const allCourses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setCourses(allCourses);

        // localStorage progress mapping for each course based on user ID or email
        const map = {};
        allCourses.forEach((course) => {
          const key = `sf_progress_${user?.id || user?.email || "guest"}_${course.slug}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            const completed = JSON.parse(saved);
            const total = course.lessons?.length || 0;
            map[course.slug] = total > 0 ? Math.round((completed.length / total) * 100) : 0;
          } else {
            map[course.slug] = 0;
          }
        });
        setProgressMap(map);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Welcome back, {user?.username || "Learner"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              Continue your courses and track your curriculum progress in real time.
            </p>
          </div>
          <Link
            href="/#courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition shadow-sm w-fit"
          >
            <BookOpen className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>

        {/* Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled Courses</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Completion</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {Object.values(progressMap).length > 0
                  ? Math.round(Object.values(progressMap).reduce((a, b) => a + b, 0) / Object.values(progressMap).length)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quiz Assessments</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Active</p>
            </div>
          </div>
        </div>

        {/* My Course Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Enrolled Tracks
            </h2>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const thumbnail =
                  course.thumbnail?.url ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
                const progress = progressMap[course.slug] || 0;

                return (
                  <div
                    key={course.id || course.slug}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                        <Image src={thumbnail} alt={course.title} fill className="object-cover" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white uppercase">
                          {course.level || "Beginner"}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {course.category || "Web Development"}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span>Progress</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/courses/${course.slug}/learn`}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" /> Resume Learning
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Enrolled Courses Found</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;