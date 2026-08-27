"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    CheckCircle2,
    Loader2,
    AlertCircle
} from "lucide-react";

const EditCoursePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [deletedLessonIds, setDeletedLessonIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const [newLesson, setNewLesson] = useState({
        title: "",
        videoUrl: "",
        duration: "10 mins",
        isPreview: false,
        content: "",
    });
    const [showAddLesson, setShowAddLesson] = useState(false);

    // load course details
    const loadCourse = async () => {
        if (!id) return;
        try {
            const isNumeric = /^\d+$/.test(id);
            const filterQuery = isNumeric
                ? `/courses?filters[$or][0][id][$eq]=${id}&filters[$or][1][documentId][$eq]=${id}&filters[$or][2][slug][$eq]=${id}&populate=*`
                : `/courses?filters[$or][0][documentId][$eq]=${id}&filters[$or][1][slug][$eq]=${id}&populate=*`;

            let data = null;
            try {
                const res = await fetchAPI(filterQuery);
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (list.length > 0) {
                    data = list[0];
                }
            } catch (filterErr) {
                console.warn("Filtered course query failed, attempting direct fetch:", filterErr);
            }

            if (!data) {
                const singleRes = await fetchAPI(`/courses/${id}?populate=*`);
                data = singleRes?.data || singleRes;
            }

            if (data && (data.id || data.documentId)) {
                setCourse(data);
                setLessons(data.lessons || []);
                setDeletedLessonIds([]);
            }
        } catch (err) {
            console.error("Failed to load course details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourse();
    }, [id]);

    // add new lesson to the course lessons list
    const handleAddLesson = (e) => {
        e.preventDefault();
        if (!newLesson.title.trim()) return;

        setLessons([...lessons, { ...newLesson, id: `temp-${Date.now()}`, isNew: true }]);
        setNewLesson({ title: "", videoUrl: "", duration: "10 mins", isPreview: false, content: "" });
        setShowAddLesson(false);
    };

    // remove lesson from the course lessons list by index
    const handleRemoveLesson = (indexToRemove) => {
        const lessonToRemove = lessons[indexToRemove];
        if (lessonToRemove?.documentId) {
            setDeletedLessonIds((prev) => [...prev, lessonToRemove.documentId]);
        }
        setLessons(lessons.filter((_, idx) => idx !== indexToRemove));
    };

    // PUT request to save course and lessons
    const handleSaveChanges = async () => {
        setSaving(true);
        setStatus({ type: "", message: "" });

        try {
            const targetCourseId = course.documentId || course.id || id;

            // 1. Update basic course details
            await fetchAPI(`/courses/${targetCourseId}`, {
                method: "PUT",
                token: token,
                body: {
                    data: {
                        title: course.title,
                        category: course.category,
                        level: course.level,
                        description: course.description,
                    },
                },
            });

            // 2. Create newly added lessons in Strapi
            const newLessonsToCreate = lessons.filter((l) => l.isNew || !l.documentId);
            for (let i = 0; i < newLessonsToCreate.length; i++) {
                const l = newLessonsToCreate[i];
                const slug =
                    l.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
                    "-" +
                    Date.now() +
                    i;

                await fetchAPI("/lessons", {
                    method: "POST",
                    token: token,
                    body: {
                        data: {
                            title: l.title,
                            slug: slug,
                            order: lessons.indexOf(l) + 1,
                            duration: l.duration || "10 mins",
                            videoUrl: l.videoUrl || "",
                            content: l.content || "",
                            isPreview: !!l.isPreview,
                            course: targetCourseId,
                        },
                    },
                });
            }

            // 3. Delete any removed lessons from Strapi
            for (const docId of deletedLessonIds) {
                try {
                    await fetchAPI(`/lessons/${docId}`, {
                        method: "DELETE",
                        token: token,
                    });
                } catch (delErr) {
                    console.warn(`Failed to delete lesson ${docId}:`, delErr);
                }
            }

            // 4. Reload fresh course data
            await loadCourse();

            setStatus({ type: "success", message: "Course & curriculum updated successfully!" });
        } catch (err) {
            console.error("Save failed:", err);
            setStatus({ type: "error", message: err.message || "Failed to update course." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <p className="text-slate-500">Course record not found.</p>
                <Link href="/dashboard/instructor" className="mt-4 text-xs font-bold text-teal-600 underline">
                    Back to Studio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/instructor"
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                Curriculum Editor
                            </span>
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {course.title}
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveChanges}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-sm w-fit"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
                    </button>
                </div>

                {status.message && (
                    <div
                        className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${status.type === "success"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                            }`}
                    >
                        {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{status.message}</span>
                    </div>
                )}

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h2 className="font-bold text-base text-slate-900 dark:text-white">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Title</label>
                            <input
                                type="text"
                                value={course.title || ""}
                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Category</label>
                            <input
                                type="text"
                                value={course.category || ""}
                                onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-base text-slate-900 dark:text-white">Lectures & Modules</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {lessons.length} lecture(s) currently configured
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddLesson(!showAddLesson)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition"
                        >
                            <Plus className="w-4 h-4" /> Add Lecture
                        </button>
                    </div>

                    {showAddLesson && (
                        <form onSubmit={handleAddLesson} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600">New Lecture Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Lecture Title (e.g. Setting Up Next.js 15)"
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="url"
                                    placeholder="YouTube Video Embed / Stream URL"
                                    value={newLesson.videoUrl}
                                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newLesson.isPreview}
                                        onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })}
                                        className="w-4 h-4 text-teal-600 rounded"
                                    />
                                    Free Preview / Trial Lecture (Accessible without enrollment)
                                </label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddLesson(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400"
                                >
                                    Add to Curriculum
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {lessons.map((lesson, idx) => (
                            <div
                                key={lesson.documentId || lesson.id || idx}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                            {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                            <span>{lesson.duration || "10 mins"}</span>
                                            {lesson.isPreview && (
                                                <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 text-[10px] font-bold">
                                                    Trial / Preview
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemoveLesson(idx)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditCoursePage;