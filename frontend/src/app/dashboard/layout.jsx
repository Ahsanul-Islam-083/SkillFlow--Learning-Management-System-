"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import RoleBadge from "@/components/common/RoleBadge";
import { Menu, User, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role } = useAuth();
  const pathname = usePathname();

  // Determine active section name for mobile header
  const getSectionTitle = () => {
    if (pathname.includes("/dashboard/student")) return "Student Learning";
    if (pathname.includes("/dashboard/instructor")) return "Instructor Studio";
    if (pathname.includes("/dashboard/manager")) return "Editorial Studio";
    if (pathname.includes("/dashboard/admin")) return "Admin Console";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Role-Aware Collapsible Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Shell with Dynamic Sidebar Spacing */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Mobile Header Bar (Only shown on screens < lg) */}
        <header className="h-16 lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-hidden"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block leading-tight">
                SkillFlow
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none mt-0.5">
                {getSectionTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RoleBadge role={role || "Student"} size="sm" />
            <Link
              href="/profile"
              className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs"
              title="My Profile"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
