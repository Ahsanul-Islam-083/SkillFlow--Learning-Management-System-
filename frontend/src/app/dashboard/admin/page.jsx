"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import PageLoader from "@/components/common/PageLoader";
import AlertBanner from "@/components/common/AlertBanner";
import AdminStatsOverview from "@/components/dashboard/admin/AdminStatsOverview";
import AdminUserTable from "@/components/dashboard/admin/AdminUserTable";
import AdminCourseTable from "@/components/dashboard/admin/AdminCourseTable";
import AdminBlogTable from "@/components/dashboard/admin/AdminBlogTable";
import { Users, BookOpen, Newspaper, PlusCircle } from "lucide-react";

const AdminDashboard = () => {

  const { user: currentAdmin, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab: "users" | "courses" | "blogs"
  const [activeTab, setActiveTab] = useState("users");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });


  const loadAdminPlatformData = useCallback(async () => {
    try {
      const [usersRes, rolesRes, coursesRes, blogsRes, enrollmentsRes] = await Promise.allSettled([
        fetchAPI("/users?populate=role", { token }),
        fetchAPI("/users-permissions/roles", { token }),
        fetchAPI("/courses?populate=*", { token }),
        fetchAPI("/blogs?status=draft&populate=*", { token }),
        fetchAPI("/enrollments?populate=*", { token }),
      ]);


      if (usersRes.status === "fulfilled") {
        setUsers(Array.isArray(usersRes.value) ? usersRes.value : usersRes.value?.data || []);
      }
      if (rolesRes.status === "fulfilled") {
        setRoles(rolesRes.value?.roles || rolesRes.value || []);
      }
      if (coursesRes.status === "fulfilled") {
        setCourses(coursesRes.value?.data || coursesRes.value || []);
      }
      if (blogsRes.status === "fulfilled") {
        setBlogs(blogsRes.value?.data || blogsRes.value || []);
      }
      if (enrollmentsRes.status === "fulfilled") {
        setEnrollments(enrollmentsRes.value?.data || enrollmentsRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAdminPlatformData();
  }, [loadAdminPlatformData]);
  if (loading) {
    return (
      <PageLoader
        color="text-amber-600 dark:text-amber-400"
        message="Loading administrative command center..."
      />
    );
  }
  // Calculate Metrics
  const totalUsers = users.length;
  const adminsCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("admin")).length;
  const managersCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("manager")).length;
  const instructorsCount = users.filter((u) => (u.role?.name || u.role?.type || "").toLowerCase().includes("instructor")).length;
  const studentsCount = totalUsers - adminsCount - managersCount - instructorsCount;


  return (
    <div className="space-y-8">
      {/* 1. Admin Hero Banner */}
      <DashboardBanner
        eyebrow="System Administration & Enterprise RBAC"
        title={`Welcome back, ${currentAdmin?.username || "Admin"}! 🛡️`}
        subtitle="Platform-wide operational control: Manage user roles, govern course curricula, and publish articles."
        actionText="Create Course Track"
        actionHref="/dashboard/manager/courses/new"
        actionIcon={PlusCircle}
        gradient="from-amber-950 via-slate-900 to-slate-900 border border-amber-900/40"
      />
      {/* 2. Platform Real Statistics & Breakdown */}
      <AdminStatsOverview
        totalUsers={totalUsers}
        totalEnrollments={enrollments.length}
        totalCourses={courses.length}
        totalBlogs={blogs.length}
        studentsCount={studentsCount}
        instructorsCount={instructorsCount}
        managersCount={managersCount}
        adminsCount={adminsCount}
      />
      <AlertBanner type={statusMessage.type} message={statusMessage.text} />
      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "users"
            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Users className="w-4 h-4 flex-shrink-0" /> <span>Users & Roles ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "courses"
            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" /> <span>Courses & Lessons ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "blogs"
            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Newspaper className="w-4 h-4 flex-shrink-0" /> <span>Blog Posts ({blogs.length})</span>
        </button>
      </div>
      {/* 4. Tab Views */}
      {activeTab === "users" && (
        <AdminUserTable
          users={users}
          roles={roles}
          currentAdmin={currentAdmin}
          token={token}
          onUserUpdated={(userId, patch) => {
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
            setStatusMessage({ type: "success", text: "User updated successfully." });
          }}
          onUserDeleted={(userId) => {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setStatusMessage({ type: "success", text: "User account deleted." });
          }}
        />
      )}
      {activeTab === "courses" && (
        <AdminCourseTable
          courses={courses}
          token={token}
          onCourseDeleted={(courseId) => {
            setCourses((prev) => prev.filter((c) => (c.documentId || c.id) !== courseId));
            setStatusMessage({ type: "success", text: "Course track deleted." });
          }}
        />
      )}
      {activeTab === "blogs" && (
        <AdminBlogTable
          blogs={blogs}
          token={token}
          onBlogDeleted={(blogId) => {
            setBlogs((prev) => prev.filter((b) => (b.documentId || b.id) !== blogId));
            setStatusMessage({ type: "success", text: "Blog article deleted." });
          }}
        />
      )}
    </div>
  );
}


export default AdminDashboard;