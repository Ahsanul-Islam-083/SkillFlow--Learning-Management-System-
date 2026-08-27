"use client";
import { useState } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import {
    Newspaper,
    Search,
    PlusCircle,
    ExternalLink,
    Trash2
} from "lucide-react";

const AdminBlogTable = ({ blogs, token, onBlogDeleted }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTargetBlog, setDeleteTargetBlog] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleDeleteBlog = async () => {
        if (!deleteTargetBlog) return;
        setDeleting(true);
        try {
            const targetId = deleteTargetBlog.documentId || deleteTargetBlog.id;
            await fetchAPI(`/blogs/${targetId}`, {
                method: "DELETE",
                token,
            });
            onBlogDeleted(targetId);
            setDeleteTargetBlog(null);
        } catch (err) {
            console.error("Failed to delete blog post:", err);
            alert(err?.message || "Failed to delete article.");
        } finally {
            setDeleting(false);
        }
    };
    const filteredBlogs = blogs.filter((b) =>
        (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-amber-500" /> Platform Editorial Articles ({blogs.length})
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage tech publications, inspect manager articles, and oversee published articles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 transition"
                        />
                    </div>
                    <Link
                        href="/dashboard/manager/blogs"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4" /> Open Blog Studio
                    </Link>
                </div>
            </div>
            {filteredBlogs.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="pb-3 pl-2">Article</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Author</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 pr-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredBlogs.map((b) => {
                                const isPub = Boolean(b.publishedAt);
                                return (
                                    <tr key={b.documentId || b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        <td className="py-4 pl-2">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-md">{b.title}</p>
                                            <p className="text-[11px] text-slate-500 truncate max-w-md">{b.excerpt || b.content?.slice(0, 80)}</p>
                                        </td>
                                        <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                                            {b.category || "Tutorials"}
                                        </td>
                                        <td className="py-4 text-slate-500">
                                            {b.author?.username || "Editorial Staff"}
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge status={isPub ? "Published" : "Draft"} />
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isPub && (
                                                    <Link
                                                        href={`/blogs/${b.slug}`}
                                                        target="_blank"
                                                        title="Read Article"
                                                        className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => setDeleteTargetBlog(b)}
                                                    title="Delete Post"
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
                <EmptyState icon={Newspaper} title="No Articles Found" description="Try adjusting your search query." />
            )}
            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteTargetBlog)}
                title="Delete Blog Post?"
                message={`Are you sure you want to permanently delete "${deleteTargetBlog?.title}"?`}
                onClose={() => setDeleteTargetBlog(null)}
                onConfirm={handleDeleteBlog}
                loading={deleting}
            />
        </div>
    );
}


export default AdminBlogTable;