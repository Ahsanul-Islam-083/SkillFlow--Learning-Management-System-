"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RoleBadge from "@/components/common/RoleBadge";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Home,
  BookOpen,
  Layers,
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  ShieldCheck,
  User,
  Compass,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  X
} from "lucide-react";

/**
 * Modern Collapsible Role-Aware Dashboard Sidebar with Home Navigation
 */
export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const userRole = (role || "").toLowerCase().trim();
  const isAdmin = userRole === "admin";
  const isManager = userRole.includes("manager") || userRole.includes("content");
  const isInstructor = userRole.includes("instructor") || userRole.includes("teacher");

  // Dynamic role-specific navigation menu items
  const navItems = useMemo(() => {
    if (isAdmin) {
      return [
        {
          label: "Admin Console",
          href: "/dashboard/admin",
          icon: ShieldCheck,
          accent: "amber",
        },
        {
          label: "Course Catalog",
          href: "/dashboard/manager/courses",
          icon: Layers,
          accent: "indigo",
        },
        {
          label: "Editorial Studio",
          href: "/dashboard/manager/blogs",
          icon: Newspaper,
          accent: "purple",
        },
        {
          label: "My Profile",
          href: "/profile",
          icon: User,
          accent: "slate",
        },
      ];
    }

    if (isManager) {
      return [
        {
          label: "Manager Hub",
          href: "/dashboard/manager",
          icon: LayoutDashboard,
          accent: "purple",
        },
        {
          label: "Course Catalog",
          href: "/dashboard/manager/courses",
          icon: Layers,
          accent: "indigo",
        },
        {
          label: "Create Course",
          href: "/dashboard/manager/courses/new",
          icon: PlusCircle,
          accent: "indigo",
        },
        {
          label: "Blog Studio",
          href: "/dashboard/manager/blogs",
          icon: Newspaper,
          accent: "purple",
        },
        {
          label: "Public Articles",
          href: "/blogs",
          icon: Compass,
          accent: "teal",
        },
        {
          label: "My Profile",
          href: "/profile",
          icon: User,
          accent: "slate",
        },
      ];
    }

    if (isInstructor) {
      return [
        {
          label: "Instructor Studio",
          href: "/dashboard/instructor",
          icon: Layers,
          accent: "teal",
        },
        {
          label: "Create New Track",
          href: "/dashboard/instructor/courses/new",
          icon: PlusCircle,
          accent: "teal",
        },
        {
          label: "Browse Catalog",
          href: "/#courses",
          icon: BookOpen,
          accent: "indigo",
        },
        {
          label: "Public Articles",
          href: "/blogs",
          icon: Compass,
          accent: "purple",
        },
        {
          label: "My Profile",
          href: "/profile",
          icon: User,
          accent: "slate",
        },
      ];
    }

    // Default: Student Navigation
    return [
      {
        label: "My Learning",
        href: "/dashboard/student",
        icon: BookOpen,
        accent: "indigo",
      },
      {
        label: "Course Catalog",
        href: "/#courses",
        icon: Compass,
        accent: "teal",
      },
      {
        label: "Tech Insights",
        href: "/blogs",
        icon: Newspaper,
        accent: "purple",
      },
      {
        label: "My Profile",
        href: "/profile",
        icon: User,
        accent: "slate",
      },
    ];
  }, [isAdmin, isManager, isInstructor]);

  const activeAccentClasses = {
    indigo:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-400 font-bold",
    teal:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-l-4 border-teal-600 dark:border-teal-400 font-bold",
    purple:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-l-4 border-purple-600 dark:border-purple-400 font-bold",
    amber:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-l-4 border-amber-600 dark:border-amber-400 font-bold",
    slate:
      "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-l-4 border-slate-700 dark:border-slate-300 font-bold",
  };

  const roleColor = isAdmin
    ? "amber"
    : isManager
    ? "purple"
    : isInstructor
    ? "teal"
    : "indigo";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div
            className={`h-20 flex items-center border-b border-slate-100 dark:border-slate-800/80 px-4 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group focus:outline-hidden"
              title="Return to Home Page"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  roleColor === "teal"
                    ? "bg-gradient-to-tr from-teal-600 to-teal-400"
                    : roleColor === "purple"
                    ? "bg-gradient-to-tr from-purple-600 to-purple-400"
                    : roleColor === "amber"
                    ? "bg-gradient-to-tr from-amber-600 to-amber-400"
                    : "bg-gradient-to-tr from-indigo-600 to-indigo-400"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0 transition-opacity duration-200">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white truncate">
                    SkillFlow
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Workspace
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Tag (Expanded View) */}
          {!isCollapsed && (
            <div className="px-4 pt-4 pb-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    Role Portal
                  </span>
                </div>
                <RoleBadge role={role || "Student"} size="sm" />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 py-3 space-y-1.5 overflow-y-auto">
            {/* 🏠 Primary Home Button */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              title={isCollapsed ? "Home Page" : undefined}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 group ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <Home className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && (
                <span className="truncate font-bold">Home</span>
              )}
            </Link>

            <div className="pt-2 pb-1">
              <div className="h-px bg-slate-200/60 dark:bg-slate-800/60" />
            </div>

            {/* Role Nav Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/#courses"
                  ? false
                  : item.href === "/dashboard/manager"
                  ? pathname === "/dashboard/manager"
                  : item.href === "/dashboard/instructor"
                  ? pathname === "/dashboard/instructor"
                  : item.href === "/dashboard/student"
                  ? pathname === "/dashboard/student"
                  : pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

              const activeClass = isActive
                ? activeAccentClasses[item.accent] || activeAccentClasses.indigo
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 font-medium";

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs transition-all duration-200 group ${activeClass} ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-current"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Widget, Theme Toggle & Collapse Trigger */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Theme Switcher & User Profile Card */}
          <div
            className={`flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 transition-all ${
              isCollapsed ? "flex-col gap-2" : ""
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : "SF"}
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.username || "Authenticated"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || (role || "Student")}
                  </p>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>

          {/* Quick Actions (Logout & Desktop Collapse Button) */}
          <div
            className={`flex items-center gap-1.5 ${
              isCollapsed ? "flex-col" : "justify-between"
            }`}
          >
            <button
              onClick={logout}
              title="Sign Out"
              className="flex-1 w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>

            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Sidebar Collapse"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
