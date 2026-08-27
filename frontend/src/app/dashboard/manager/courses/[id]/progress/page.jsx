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
  Search
} from "lucide-react";

export default function ManagerCourseProgressPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        } catch (e) {
          console.warn("Filtered course query failed:", e);
        }

        if (!courseData) {
          const singleRes = await fetchAPI(`/courses/${id}?populate=*`);
          courseData = singleRes?.data || singleRes;
        }

        if (courseData) {
          setCourse(courseData);
          const courseDocId = courseData.documentId || courseData.id;
          try {
            const enrollRes = await fetchAPI(
              `/enrollments?filters[course][documentId][$eq]=${courseDocId}&populate[0]=student&populate[1]=completedLessons`,
              { token }
            );
            const enrollList = Array.isArray(enrollRes?.data) ? enrollRes.data : Array.isArray(enrollRes) ? enrollRes : [];
            setEnrollments(enrollList);
          } catch (enrollErr) {
            console.warn("Failed to fetch enrollments for course:", enrollErr);
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
    return <PageLoader color="text-purple-600 dark:text-purple-400" message="Loading learner progress analytics..." />;
  }

  const totalStudents = enrollments.length;
  const completedStudents = enrollments.filter((e) => e.isCompleted || (e.progress || 0) >= 100).length;
  const inProgressStudents = totalStudents - completedStudents;
  const avgProgress =
    totalStudents > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / totalStudents)
      : 0;

  const filteredEnrollments = enrollments.filter((e) => {
    const username = e.student?.username || "";
    const email = e.student?.email || "";
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalLessonsCount = course?.lessons?.length || 0;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Subpage Header */}
        <SubpageHeader
          backHref="/dashboard/manager/courses"
          eyebrow="Student Performance Analytics"
          eyebrowColor="text-purple-600 dark:text-purple-400"
          title={course?.title || "Course Track"}
          actions={
            <Link
              href={`/dashboard/manager/courses/${course?.documentId || course?.id || id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm w-fit"
            >
              <BookOpen className="w-4 h-4" /> Edit Curriculum
            </Link>
          }
        />

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Enrolled Learners" value={totalStudents} icon={Users} color="purple" subtitle="Active students in course" />
          <StatCard title="Completed Course" value={completedStudents} icon={Award} color="emerald" subtitle="Certificates earned" />
          <StatCard title="In Progress" value={inProgressStudents} icon={Clock} color="indigo" subtitle="Active curriculum study" />
          <StatCard title="Avg Completion" value={`${avgProgress}%`} icon={CheckCircle2} color="teal" subtitle="Cohort average" />
        </div>

        {/* Learner Progress Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" /> Enrolled Learners Progress
              </h2>
            </div>
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search learner name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          {filteredEnrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="pb-3 pl-2">Learner</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Lectures Done</th>
                    <th className="pb-3 min-w-[140px]">Progress Bar</th>
                    <th className="pb-3 pr-2 text-right">Completion</th>
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
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                              {student.username ? student.username.slice(0, 2).toUpperCase() : "ST"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{student.username || "Enrolled Student"}</p>
                              <p className="text-[11px] text-slate-500">{student.email || "No email linked"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <StatusBadge status={isCompleted ? "Completed" : "In Progress"} size="sm" />
                        </td>
                        <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {completedCount} of {totalLessonsCount} lectures
                        </td>
                        <td className="py-4">
                          <ProgressBar progress={progress} isCompleted={isCompleted} color="purple" />
                        </td>
                        <td className="py-4 pr-2 text-right font-black text-slate-900 dark:text-white">
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
              description="Students who enroll in this track will automatically appear in this analytics table."
            />
          )}
        </div>

      </div>
    </div>
  );
}