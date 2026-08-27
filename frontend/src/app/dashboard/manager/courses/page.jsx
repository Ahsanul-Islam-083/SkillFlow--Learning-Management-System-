"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import StatusBadge from "@/components/common/StatusBadge";
import {
    ArrowLeft,
    PlusCircle,
    Search,
    BookOpen,
    Edit,
    Trash2,
    Users,
    ExternalLink,
    Layers,
    Award,
    Loader2,
    AlertTriangle
} from "lucide-react";

const ManagerCoursesPage = () => {

    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [deleteCourse, setDeleteCourse] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadCourses = async () => {
        try {
            const res = await fetchAPI("/courses?populate=*", { token });
            const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            setCourses(list);
        } catch (err) {
            console.error("Failed to load courses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [token]);

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

    const filteredCourses = courses.filter((c) => {
        const matchesSearch =
            c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
        );
    }
    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/manager"
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                Curriculum Operations
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                                Course Catalog Studio
                            </h1>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/manager/courses/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm w-fit"
                    >
                        <PlusCircle className="w-4 h-4" /> Create New Course
                    </Link>
                </div>
                {/* Search & Filter */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search course tracks by title or topic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium transition w-full sm:w-auto"
                    >
                        <option value="All">All Categories</option>
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                </div>
                {/* Course Table */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        Platform Courses ({filteredCourses.length})
                    </h2>
                    {filteredCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="pb-3 pl-2">Course Track</th>
                                        <th className="pb-3">Category & Level</th>
                                        <th className="pb-3">Curriculum</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 pr-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredCourses.map((c) => {
                                        const thumbnail =
                                            c.thumbnailUrl ||
                                            c.thumbnail?.url ||
                                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
                                        const isPub = c.isPublished !== false;
                                        const cId = c.documentId || c.id;
                                        return (
                                            <tr key={cId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group">
                                                <td className="py-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-14 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                                            <Image src={thumbnail} alt={c.title} fill className="object-cover" />
                                                        </div>
                                                        <div className="min-w-0 max-w-sm">
                                                            <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 transition truncate">
                                                                {c.title}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                                {c.shortDescription || c.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                                                        {c.category || "Web Development"}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                                                        {c.level || "Beginner"}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-slate-600 dark:text-slate-400">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {c.lessons?.length || 0} Lessons
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 block">
                                                        {c.quizzes?.length || 0} Quizzes
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <StatusBadge status={isPub ? "Published" : "Draft"} />
                                                </td>
                                                <td className="py-4 pr-2 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/courses/${c.slug}`}
                                                            target="_blank"
                                                            title="View Public Course"
                                                            className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/manager/courses/${cId}/progress`}
                                                            title="Student Progress Analytics"
                                                            className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/manager/courses/${cId}/edit`}
                                                            title="Edit Curriculum & Lessons"
                                                            className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteCourse(c)}
                                                            title="Delete Course Track"
                                                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No courses match search</h3>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {deleteCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Course Track?</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Are you sure you want to delete &quot;{deleteCourse.title}&quot;? All associated lessons and quizzes will be removed.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteCourse(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteCourse}
                                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span>{deleting ? "Deleting..." : "Delete Permanently"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerCoursesPage;