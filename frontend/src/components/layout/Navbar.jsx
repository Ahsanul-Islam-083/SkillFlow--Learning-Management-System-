"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
    BookOpen,
    LogOut,
    LayoutDashboard,
    GraduationCap,
    ShieldCheck,
    FileEdit
} from "lucide-react";

const Navbar = () => {

    const { user, role, logout, isAuthenticated } = useAuth();

    const getDashboardRoute = () => {
        switch (role) {
            case "Admin":
                return {
                    path: "/dashboard/admin",
                    label: "Admin Panel",
                    icon: ShieldCheck,
                    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                };
            case "Content Manager":
                return {
                    path: "/dashboard/manager",
                    label: "Manager Hub",
                    icon: FileEdit,
                    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                };
            case "Instructor":
                return {
                    path: "/dashboard/instructor",
                    label: "Instructor Hub",
                    icon: GraduationCap,
                    badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                };
            case "Student":
            default:
                return {
                    path: "/dashboard/student",
                    label: "My Learning",
                    icon: LayoutDashboard,
                    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                };
        }
    };

    const dashboardInfo = getDashboardRoute();
    const DashboardIcon = dashboardInfo.icon;

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="tracking-tight">
                        Skill<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                    </span>
                </Link>

                {/* navigation links */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition">
                        Courses
                    </Link>
                    <Link href="/blogs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition">
                        Articles & News
                    </Link>
                </nav>

                {/* action buttons and theme switch */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dashboardInfo.badgeColor} hidden sm:inline-block`}>
                                {role}
                            </span>

                            <Link
                                href={dashboardInfo.path}
                                className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shadow-sm"
                            >
                                <DashboardIcon className="w-4 h-4" />
                                <span>{dashboardInfo.label}</span>
                            </Link>

                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg transition"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shadow-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;