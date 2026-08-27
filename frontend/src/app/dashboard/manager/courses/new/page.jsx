"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload";
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const ManagerNewCoursePage = () => {

    const router = useRouter();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Web Development",
        level: "Beginner",
        shortDescription: "",
        description: "",
        thumbnailUrl: "",
        isPublished: true,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const autoSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setFormData((prev) => ({
            ...prev,
            title,
            slug: autoSlug,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formData.title.trim() || !formData.description.trim() || !formData.shortDescription.trim()) {
            setError("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        try {
            const generatedSlug =
                formData.slug.trim() ||
                formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const payload = {
                data: {
                    title: formData.title.trim(),
                    slug: generatedSlug,
                    category: formData.category,
                    level: formData.level,
                    shortDescription: formData.shortDescription.trim(),
                    description: formData.description.trim(),
                    thumbnailUrl: formData.thumbnailUrl,
                    isPublished: formData.isPublished,
                    instructor: user?.id,
                },
            };
            const res = await fetchAPI("/courses", {
                method: "POST",
                token: token,
                body: payload,
            });
            const newCourseId = res?.data?.documentId || res?.data?.id || res?.documentId || res?.id;
            if (newCourseId) {
                router.push(`/dashboard/manager/courses/${newCourseId}/edit`);
            } else {
                router.push("/dashboard/manager/courses");
            }
        } catch (err) {
            console.error("Create course failed:", err);
            setError(err?.message || "Failed to create course track.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/manager/courses"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Curriculum Authoring
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                            Create New Course Track
                        </h1>
                    </div>
                </div>
                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Track Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Master Next.js 15 Full-Stack Architecture"
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL Slug *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="master-nextjs-15"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 font-mono transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="App Development">App Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Difficulty Level *</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <ImageUpload
                            value={formData.thumbnailUrl}
                            onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                            label="Course Thumbnail (ImgBB)"
                        />
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Summary *</label>
                            <input
                                type="text"
                                required
                                placeholder="One sentence overview shown on course cards..."
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Syllabus Description *</label>
                            <textarea
                                rows={4}
                                required
                                placeholder="Comprehensive course syllabus and learning outcomes..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href="/dashboard/manager/courses"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            <span>{submitting ? "Creating Track..." : "Create Course & Add Lessons"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManagerNewCoursePage;