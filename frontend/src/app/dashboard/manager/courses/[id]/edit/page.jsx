"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import QuizBuilder from "@/components/dashboard/QuizBuilder";
import SubpageHeader from "@/components/dashboard/SubpageHeader";
import AlertBanner from "@/components/common/AlertBanner";
import PageLoader from "@/components/common/PageLoader";
import {
    Plus,
    Trash2,
    Save,
    Layers,
    HelpCircle,
    FileText,
    Loader2
} from "lucide-react";

export default function ManagerEditCoursePage() {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [deletedQuizIds, setDeletedQuizIds] = useState([]);
    const [activeTab, setActiveTab] = useState("curriculum");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const [courseForm, setCourseForm] = useState({
        title: "",
        category: "Web Development",
        level: "Beginner",
        shortDescription: "",
        description: "",
        isPublished: true,
    });

    const normalizeLevel = (rawLevel) => {
        if (!rawLevel) return "Beginner";
        const lower = String(rawLevel).toLowerCase().trim();
        if (lower === "beginner") return "Beginner";
        if (lower === "intermediate") return "Intermediate";
        if (lower === "advanced") return "Advanced";
        return "Beginner";
    };

    useEffect(() => {
        async function loadCourse() {
            if (!id) return;
            try {
                const isNumeric = /^\d+$/.test(id);
                const populateParam = "populate[0]=lessons&populate[1]=quizzes&populate[2]=quizzes.questions";
                const filterQuery = isNumeric
                    ? `/courses?filters[$or][0][id][$eq]=${id}&filters[$or][1][documentId][$eq]=${id}&filters[$or][2][slug][$eq]=${id}&${populateParam}`
                    : `/courses?filters[$or][0][documentId][$eq]=${id}&filters[$or][1][slug][$eq]=${id}&${populateParam}`;

                let courseData = null;
                try {
                    const res = await fetchAPI(filterQuery);
                    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                    if (list.length > 0) courseData = list[0];
                } catch (e) {
                    console.warn("Filtered fetch failed:", e);
                }

                if (!courseData) {
                    const singleRes = await fetchAPI(`/courses/${id}?${populateParam}`);
                    courseData = singleRes?.data || singleRes;
                }

                if (courseData) {
                    setCourse(courseData);
                    setCourseForm({
                        title: courseData.title || "",
                        category: courseData.category || "Web Development",
                        level: normalizeLevel(courseData.level),
                        shortDescription: courseData.shortDescription || "",
                        description: courseData.description || "",
                        isPublished: courseData.isPublished !== false,
                    });
                    setLessons(courseData.lessons || []);
                    setQuizzes(courseData.quizzes || []);
                }
            } catch (err) {
                console.error("Failed to load course:", err);
            } finally {
                setLoading(false);
            }
        }

        loadCourse();
    }, [id]);

    const handleAddLesson = () => {
        const newLesson = {
            id: `temp-${Date.now()}`,
            title: "New Lecture",
            duration: "10 mins",
            videoUrl: "",
            content: "",
            isPreview: false,
            order: lessons.length + 1,
        };
        setLessons([...lessons, newLesson]);
    };

    const handleLessonChange = (idx, field, value) => {
        const updated = [...lessons];
        updated[idx] = { ...updated[idx], [field]: value };
        setLessons(updated);
    };

    const handleRemoveLesson = (idx) => {
        setLessons(lessons.filter((_, i) => i !== idx));
    };

    const handleSaveAll = async () => {
        setSaving(true);
        setStatusMessage({ type: "", text: "" });

        try {
            const targetCourseId = course.documentId || course.id;

            // 1. Process Lessons (with auto-generated slug for Strapi UID requirement)
            const lessonRelations = [];
            for (let idx = 0; idx < lessons.length; idx++) {
                const lesson = lessons[idx];

                // Generate a unique URL-safe slug from the lesson title + timestamp
                const generatedSlug =
                    lesson.slug ||
                    lesson.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "") +
                    "-" +
                    Date.now() +
                    "-" +
                    idx;

                const lessonPayload = {
                    data: {
                        title: lesson.title,
                        slug: generatedSlug,              // ← Required by Strapi lesson schema
                        duration: lesson.duration || "10 mins",
                        videoUrl: lesson.videoUrl || "",
                        content: lesson.content || "",
                        isPreview: Boolean(lesson.isPreview),
                        order: Number(lesson.order) || (idx + 1),
                        course: targetCourseId,
                    },
                };


                if (String(lesson.id).startsWith("temp-")) {
                    const createRes = await fetchAPI("/lessons", {
                        method: "POST",
                        token: token,
                        body: lessonPayload,
                    });
                    const createdDocId = createRes?.data?.documentId || createRes?.data?.id;
                    if (createdDocId) lessonRelations.push(createdDocId);
                } else {
                    const targetLessonId = lesson.documentId || lesson.id;
                    await fetchAPI(`/lessons/${targetLessonId}`, {
                        method: "PUT",
                        token: token,
                        body: lessonPayload,
                    });
                    lessonRelations.push(targetLessonId);
                }
            }

            // 2. Process Quizzes
            const quizRelations = [];
            for (const quiz of quizzes) {
                const formattedQuestions = (quiz.questions || []).map((q) => ({
                    questionText: q.questionText || q.question || "Assessment Question",
                    options: Array.isArray(q.options) ? q.options : [],
                    correctAnswerIndex: Number(q.correctAnswerIndex ?? q.correctAnswer ?? 0),
                }));

                const quizPayload = {
                    data: {
                        title: quiz.title || "Course Quiz",
                        passingScore: Number(quiz.passingScore) || 80,
                        questions: formattedQuestions,
                        course: targetCourseId,
                    },
                };

                if (String(quiz.id).startsWith("temp-")) {
                    const createRes = await fetchAPI("/quizzes", {
                        method: "POST",
                        token: token,
                        body: quizPayload,
                    });
                    const createdDocId = createRes?.data?.documentId || createRes?.data?.id;
                    if (createdDocId) quizRelations.push(createdDocId);
                } else {
                    const targetQuizId = quiz.documentId || quiz.id;
                    await fetchAPI(`/quizzes/${targetQuizId}`, {
                        method: "PUT",
                        token: token,
                        body: quizPayload,
                    });
                    quizRelations.push(targetQuizId);
                }
            }

            // 3. Delete Removed Quizzes
            for (const quizId of deletedQuizIds) {
                if (!String(quizId).startsWith("temp-")) {
                    try {
                        await fetchAPI(`/quizzes/${quizId}`, {
                            method: "DELETE",
                            token: token,
                        });
                    } catch (delErr) {
                        console.warn("Failed to delete quiz:", delErr);
                    }
                }
            }

            // 4. Update Course Metadata
            await fetchAPI(`/courses/${targetCourseId}`, {
                method: "PUT",
                token: token,
                body: {
                    data: {
                        title: courseForm.title,
                        category: courseForm.category,
                        level: normalizeLevel(courseForm.level),
                        shortDescription: courseForm.shortDescription,
                        description: courseForm.description,
                        isPublished: courseForm.isPublished,
                        lessons: lessonRelations,
                        quizzes: quizRelations,
                    },
                },
            });

            setStatusMessage({ type: "success", text: "Course curriculum and quizzes saved successfully!" });
            setDeletedQuizIds([]);
        } catch (err) {
            console.error("Failed to save changes:", err);
            setStatusMessage({ type: "error", text: err?.message || "Failed to save course changes." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <PageLoader color="text-purple-600 dark:text-purple-400" message="Loading curriculum studio..." />;
    }

    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Subpage Header */}
                <SubpageHeader
                    backHref="/dashboard/manager/courses"
                    eyebrow="Curriculum Editor"
                    eyebrowColor="text-purple-600 dark:text-purple-400"
                    title={course?.title || "Course Studio"}
                    actions={
                        <button
                            onClick={handleSaveAll}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-sm"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
                        </button>
                    }
                />

                <AlertBanner type={statusMessage.type} message={statusMessage.text} />

                {/* Tabs */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab("curriculum")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "curriculum"
                            ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        <Layers className="w-4 h-4" /> Lectures ({lessons.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("quizzes")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "quizzes"
                            ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        <HelpCircle className="w-4 h-4" /> Quizzes ({quizzes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "details"
                            ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Metadata
                    </button>
                </div>

                {/* TAB 1: CURRICULUM & LESSONS */}
                {activeTab === "curriculum" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-base text-slate-900 dark:text-white">Curriculum Lectures</h2>
                            <button
                                onClick={handleAddLesson}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-bold text-xs hover:bg-purple-100 transition"
                            >
                                <Plus className="w-4 h-4" /> Add Lecture
                            </button>
                        </div>

                        <div className="space-y-4">
                            {lessons.map((lesson, idx) => (
                                <div
                                    key={lesson.id || idx}
                                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                            Lesson #{idx + 1}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveLesson(idx)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lecture Title</label>
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) => handleLessonChange(idx, "title", e.target.value)}
                                                className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration</label>
                                            <input
                                                type="text"
                                                value={lesson.duration}
                                                onChange={(e) => handleLessonChange(idx, "duration", e.target.value)}
                                                className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Embed URL (YouTube or Direct Video)</label>
                                        <input
                                            type="text"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={lesson.videoUrl || ""}
                                            onChange={(e) => handleLessonChange(idx, "videoUrl", e.target.value)}
                                            className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition font-mono"
                                        />
                                    </div>

                                    {/* Free Preview / Trial Lecture Toggle */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(lesson.isPreview)}
                                                onChange={(e) => handleLessonChange(idx, "isPreview", e.target.checked)}
                                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 focus:ring-2"
                                            />
                                            <span>Free Preview / Trial Lecture (Accessible without enrollment)</span>
                                        </label>
                                    </div>


                                    <div>
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lecture Notes & Summary (Markdown)</label>
                                        <textarea
                                            rows={3}
                                            value={lesson.content || ""}
                                            onChange={(e) => handleLessonChange(idx, "content", e.target.value)}
                                            placeholder="Key lecture concepts and reference guides..."
                                            className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 2: QUIZZES & MCQS */}
                {activeTab === "quizzes" && (
                    <QuizBuilder
                        quizzes={quizzes}
                        onChange={setQuizzes}
                        onDeleteQuiz={(deletedId) => setDeletedQuizIds((prev) => [...prev, deletedId])}
                    />
                )}

                {/* TAB 3: COURSE METADATA */}
                {activeTab === "details" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Title</label>
                            <input
                                type="text"
                                value={courseForm.title}
                                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                                <select
                                    value={courseForm.category}
                                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                    className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="App Development">App Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Level</label>
                                <select
                                    value={courseForm.level}
                                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                                    className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Summary</label>
                            <input
                                type="text"
                                value={courseForm.shortDescription}
                                onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Description</label>
                            <textarea
                                rows={4}
                                value={courseForm.description}
                                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}