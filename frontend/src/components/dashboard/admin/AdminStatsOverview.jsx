"use client";
import StatCard from "@/components/dashboard/StatCard";
import { Users, TrendingUp, BookOpen, Newspaper, ShieldCheck } from "lucide-react";

const AdminStatsOverview = ({
    totalUsers = 0,
    totalEnrollments = 0,
    totalCourses = 0,
    totalBlogs = 0,
    studentsCount = 0,
    instructorsCount = 0,
    managersCount = 0,
    adminsCount = 0,
}) => {
    return (
        <div className="space-y-4">
            {/* 4 Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Platform Users"
                    value={totalUsers}
                    icon={Users}
                    color="indigo"
                    subtitle={`${studentsCount} Students • ${instructorsCount} Instructors`}
                />
                <StatCard
                    title="Total Enrollments"
                    value={totalEnrollments}
                    icon={TrendingUp}
                    color="teal"
                    subtitle="Active curriculum enrollments"
                />
                <StatCard
                    title="Platform Courses"
                    value={totalCourses}
                    icon={BookOpen}
                    color="amber"
                    subtitle="Curriculum tracks active"
                    href="/dashboard/manager/courses"
                />
                <StatCard
                    title="Published Articles"
                    value={totalBlogs}
                    icon={Newspaper}
                    color="purple"
                    subtitle="Community tech blogs"
                    href="/dashboard/manager/blogs"
                />
            </div>
            {/* 4-Role Distribution Breakdown Bar */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Platform Role Distribution Breakdown
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                        <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Students</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{studentsCount}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40">
                        <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">Instructors</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{instructorsCount}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                        <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Content Managers</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{managersCount}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                        <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Administrators</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{adminsCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatsOverview;