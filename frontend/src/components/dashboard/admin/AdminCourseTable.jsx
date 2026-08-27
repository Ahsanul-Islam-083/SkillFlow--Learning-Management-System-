"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAPI } from "@/lib/api";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import {
    BookOpen,
    Search,
    PlusCircle,
    ExternalLink,
    Users,
    Edit,
    Trash2
} from "lucide-react";

const AdminCourseTable = ({ courses, token, onCourseDeleted }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTargetCourse, setDeleteTargetCourse] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleDeleteCourse = async () => {
        if (!deleteTargetCourse) return;
        setDeleting(true);
        try {
            const targetId = deleteTargetCourse.documentId || deleteTargetCourse.id;
            await fetchAPI(`/courses/${targetId}`, {
                method: "DELETE",
                token,
            });
            onCourseDeleted(targetId);
            setDeleteTargetCourse(null);
        } catch (err) {
            console.error("Failed to delete course:", err);
            alert(err?.message || "Failed to delete course.");
        } finally {
            setDeleting(false);
        }
    };
    const filteredCourses = courses.filter((c) =>
        (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-500" /> Platform Courses & Curricula ({courses.length})
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Full administrative control: inspect lectures, edit curriculum tracks, and check progress.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search course tracks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 transition"
                        />
                    </div>
                    <Link
                        href="/dashboard/manager/courses/new"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4" /> Create Track
                    </Link>
                </div>
            </div>
            {filteredCourses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="pb-3 pl-2">Course Track</th>
                                <th className="pb-3">Category & Level</th>
                                <th className="pb-3">Curriculum Content</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 pr-2 text-right">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredCourses.map((c) => {
                                const thumbnail =
                                    c.thumbnailUrl ||
                                    c.thumbnail?.url ||
                                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
                                const cId = c.documentId || c.id;
                                return (
                                    <tr key={cId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-14 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                                    <Image src={thumbnail} alt={c.title} fill className="object-cover" />
                                                </div>
                                                <div className="min-w-0 max-w-sm">
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{c.title}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{c.shortDescription || c.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="font-bold text-slate-700 dark:text-slate-300 block">{c.category || "Web Dev"}</span>
                                            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">{c.level || "Beginner"}</span>
                                        </td>
                                        <td className="py-4 text-slate-600 dark:text-slate-400">
                                            <span className="font-semibold text-slate-900 dark:text-white">{c.lessons?.length || 0} Lessons</span>
                                            <span className="text-[11px] text-slate-500 block">{c.quizzes?.length || 0} Quizzes</span>
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge status={c.isPublished !== false ? "Published" : "Draft"} />
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/courses/${c.slug}`}
                                                    target="_blank"
                                                    title="Preview Public Course"
                                                    className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/manager/courses/${cId}/progress`}
                                                    title="Learner Progress Analytics"
                                                    className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition"
                                                >
                                                    <Users className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/manager/courses/${cId}/edit`}
                                                    title="Edit Syllabus & Quizzes"
                                                    className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTargetCourse(c)}
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
                <EmptyState icon={BookOpen} title="No Courses Found" description="Try adjusting your search keyword." />
            )}
            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteTargetCourse)}
                title="Delete Course Track?"
                message={`Are you sure you want to permanently delete "${deleteTargetCourse?.title}"? All associated lessons will be deleted.`}
                onClose={() => setDeleteTargetCourse(null)}
                onConfirm={handleDeleteCourse}
                loading={deleting}
            />
        </div>
    );
};

export default AdminCourseTable;