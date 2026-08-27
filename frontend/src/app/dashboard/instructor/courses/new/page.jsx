"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
    ArrowLeft,
    PlusCircle,
    Sparkles,
    Image as ImageIcon,
    Layers,
    Loader2,
    AlertCircle
} from "lucide-react";
import ImageUpload from "@/components/common/ImageUpload";

const NewCoursePage = () => {
    const router = useRouter();
    const { user, token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Web Development",
        level: "beginner",
        description: "",
        thumbnailUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // slug auto-generation based on title input
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const generatedSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        setFormData((prev) => ({
            ...prev,
            title,
            slug: generatedSlug,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Prepare the payload for course creation
            const coursePayload = {
                data: {
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
                    category: formData.category,
                    level: formData.level,
                    description: formData.description,
                    instructor: user?.id, // link the current instructor
                    lessons: [],
                    quizzes: [],
                },
            };

            const res = await fetchAPI("/courses", {
                method: "POST",
                token: token,
                body: coursePayload,
            });

            const createdId = res?.data?.id || res?.data?.documentId || res?.id;

            // If course creation is successful, redirect to the edit page
            if (createdId) {
                router.push(`/dashboard/instructor/courses/${createdId}/edit`);
            } else {
                router.push("/dashboard/instructor");
            }
        } catch (err) {
            console.error("Course creation failed:", err);
            setError(err.message || "Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">


                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/instructor"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                            Course Builder
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                            Create New Learning Track
                        </h1>
                    </div>
                </div>

                {/* error alert */}
                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}


                <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Master Next.js 15 & Modern Full-Stack"
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="master-nextjs-15"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500 font-mono transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500 transition"
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="Frontend Development">Frontend Development</option>
                                    <option value="Backend Engineering">Backend Engineering</option>
                                    <option value="UI/UX & Design">UI/UX & Design</option>
                                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Difficulty Level
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500 transition"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Thumbnail Image (Optional)
                                </label>
                                <ImageUpload
                                    value={formData.thumbnailUrl}
                                    onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                                    label="Course Thumbnail Image"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Course Description *
                            </label>
                            <textarea
                                rows={4}
                                required
                                placeholder="Describe what students will learn and achieve from this comprehensive course..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href="/dashboard/instructor"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-sm"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                            <span>{loading ? "Creating Track..." : "Create & Build Curriculum"}</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default NewCoursePage;