"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
    BookOpen,
    LogOut,
    LayoutDashboard,
    GraduationCap,
    ShieldCheck,
    FileEdit,
    Menu,
    X,
    User
} from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const { user, role, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Do not render global Navbar inside the dashboard workspace
    if (pathname && pathname.startsWith("/dashboard")) {
        return null;
    }

   const getDashboardRoute = () => {
    if (role === "Admin") {
      return { 
        path: "/dashboard/admin", 
        label: "Admin Panel", 
        icon: ShieldCheck, 
        badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" 
      };
    } else if (role === "Content Manager") {
      return { 
        path: "/dashboard/manager", 
        label: "Manager Hub", 
        icon: FileEdit, 
        badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" 
      };
    } else if (role === "Instructor") {
      return { 
        path: "/dashboard/instructor", 
        label: "Instructor Hub", 
        icon: GraduationCap, 
        badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300" 
      };
    } else {
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
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 dark:text-white group flex-shrink-0">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs flex-shrink-0">
                        <Image
                            src="/logosf.png"
                            alt="SkillFlow Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="tracking-tight font-extrabold">
                        Skill<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/courses"
                        className={`text-sm font-semibold transition ${
                            pathname === "/courses"
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                        }`}
                    >
                        Courses
                    </Link>
                    <Link
                        href="/about"
                        className={`text-sm font-semibold transition ${
                            pathname === "/about"
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                        }`}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/blogs"
                        className={`text-sm font-semibold transition ${
                            pathname === "/blogs" || pathname?.startsWith("/blogs/")
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                        }`}
                    >
                        Articles & News
                    </Link>
                </nav>

                {/* Right Actions: Theme Toggle + Auth / Mobile Menu Trigger */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="hidden sm:flex items-center gap-2.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${dashboardInfo.badgeColor} hidden lg:inline-block`}>
                                {role}
                            </span>

                            <Link
                                href={dashboardInfo.path}
                                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition shadow-xs"
                            >
                                <DashboardIcon className="w-4 h-4" />
                                <span>{dashboardInfo.label}</span>
                            </Link>

                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl transition"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 px-3 py-2 rounded-xl transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition shadow-xs"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        aria-label="Toggle Mobile Navigation"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg px-4 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col space-y-2">
                        <Link
                            href="/courses"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                                pathname === "/courses"
                                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                        >
                            <span>Explore Courses</span>
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                                pathname === "/about"
                                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                        >
                            <span>About Us</span>
                        </Link>
                        <Link
                            href="/blogs"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                                pathname === "/blogs" || pathname?.startsWith("/blogs/")
                                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                        >
                            <span>Articles & News</span>
                        </Link>
                    </nav>

                    {/* Auth & Dashboard Actions in Mobile Drawer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        {isAuthenticated ? (
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Signed in as <strong className="text-slate-800 dark:text-white">{user?.username}</strong>
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dashboardInfo.badgeColor}`}>
                                        {role}
                                    </span>
                                </div>
                                <Link
                                    href={dashboardInfo.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs"
                                >
                                    <DashboardIcon className="w-4 h-4" />
                                    <span>{dashboardInfo.label}</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;