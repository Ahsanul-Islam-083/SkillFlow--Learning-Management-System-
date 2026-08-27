"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
  PlusCircle,
  BookOpen,
  Users,
  Layers,
  Edit3,
  BarChart3,
  ExternalLink,
  Loader2
} from "lucide-react";

const InstructorDashboard = () => {

  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function loadInstructorCourses() {
      try {
        
        const res = await fetchAPI("/courses?populate=*");
        const myCourses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setCourses(myCourses);
      } catch (err) {
        console.error("Failed to load instructor courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInstructorCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
      </div>
    );
  }

  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

     
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-900/40 text-white shadow-md">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Instructor Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Instructor Dashboard 🎓
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage curricula, publish lectures, and monitor student engagement.
            </p>
          </div>
          <Link
            href="/dashboard/instructor/courses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm w-fit"
          >
            <PlusCircle className="w-4 h-4" /> Create New Track
          </Link>
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">My Authored Courses</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Lectures</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{totalLessons}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Enrolled Students</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Active</p>
            </div>
          </div>
        </div>

        {/* course list */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Manage My Courses
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {courses.length} Course(s) Total
            </span>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const thumbnail =
                  course.thumbnail?.url ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
                const lessonCount = course.lessons?.length || 0;

                return (
                  <div
                    key={course.id || course.slug}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                        <Image src={thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white uppercase">
                          {course.level || "Beginner"}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-semibold">
                          <span>{course.category || "Development"}</span>
                          <span className="text-slate-400">{lessonCount} Lectures</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <Link
                        href={`/dashboard/instructor/courses/${course.documentId || course.id}/edit`}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-500" /> Edit Track
                      </Link>

                      <Link
                        href={`/dashboard/instructor/courses/${course.documentId || course.id}/progress`}
                        className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <BarChart3 className="w-3.5 h-3.5" /> Progress
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Courses Created Yet</h3>
              <Link
                href="/dashboard/instructor/courses/new"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" /> Create Your First Course
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;