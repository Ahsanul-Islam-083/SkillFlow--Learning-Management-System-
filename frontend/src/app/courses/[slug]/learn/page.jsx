"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
    Play,
    CheckCircle,
    Circle,
    ChevronRight,
    ArrowLeft,
    FileQuestion,
    Menu,
    X,
    Loader2
} from "lucide-react";

const CourseLearningPlayer = () => {

    const { slug } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // local storage key for saving progress
    const storageKey = `sf_progress_${user?.id || user?.email || "guest"}_${slug}`;

    useEffect(() => {
        async function loadCourseData() {
            try {
                const res = await fetchAPI(`/courses?filters[slug][$eq]=${slug}&populate=*`);
                const courses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (courses.length > 0) {
                    setCourse(courses[0]);
                }
            } catch (err) {
                console.error("Failed to load course details:", err);
            } finally {
                setLoading(false);
            }
        }
        if (slug) loadCourseData();
    }, [slug]);

    // after refresh, restore completed lessons from local storage
    useEffect(() => {
        if (!slug) return;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setCompletedLessons(new Set(parsed));
                }
            }
        } catch (e) {
            console.error("Failed to restore progress:", e);
        }
    }, [slug, storageKey]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">Course curriculum not found.</p>
                <Link href="/dashboard/student" className="mt-4 text-xs font-bold text-indigo-600 underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const lessons = course.lessons || [];
    const quizzes = course.quizzes || [];
    const currentLesson = lessons[currentLessonIndex] || null;

    // toggle lesson completion and store progress in local storage
    const toggleCompleteAndNext = (lessonId) => {
        setCompletedLessons((prev) => {
            const updated = new Set(prev);
            if (updated.has(lessonId)) {
                updated.delete(lessonId);
            } else {
                updated.add(lessonId);
            }

            // Save updated progress to local storage
            try {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(updated)));
            } catch (e) {
                console.error("Failed to save progress:", e);
            }

            return updated;
        });

        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex((prev) => prev + 1);
        }
    };

    const progressPercentage = lessons.length > 0
        ? Math.round((completedLessons.size / lessons.length) * 100)
        : 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

          
            <div className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/student"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                                {course.title}
                            </h1>
                            <p className="text-[11px] text-slate-400">
                                {completedLessons.size} of {lessons.length} Lectures Done • {progressPercentage}% Completed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-emerald-400">{progressPercentage}%</span>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

          
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">

                {/* left side video content */}
                <div className="flex-1 space-y-6">
                    {currentLesson ? (
                        <div className="space-y-6">

                            {/* video frame */}
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                                {currentLesson.videoUrl ? (
                                    currentLesson.videoUrl.includes("youtube") || currentLesson.videoUrl.includes("youtu.be") ? (
                                        <iframe
                                            src={currentLesson.videoUrl.replace("watch?v=", "embed/")}
                                            title={currentLesson.title}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video src={currentLesson.videoUrl} controls className="w-full h-full" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                        <Play className="w-12 h-12 mb-2 stroke-1" />
                                        <p className="text-xs">No video stream linked for this lecture.</p>
                                    </div>
                                )}
                            </div>

                            {/* lesson controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <div>
                                    <span className="text-xs font-semibold text-indigo-400">
                                        Lecture {currentLessonIndex + 1} of {lessons.length}
                                    </span>
                                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                                        {currentLesson.title}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => toggleCompleteAndNext(currentLesson.id || currentLessonIndex)}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${completedLessons.has(currentLesson.id || currentLessonIndex)
                                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>
                                        {completedLessons.has(currentLesson.id || currentLessonIndex)
                                            ? "Completed (Click to Undo)"
                                            : "Mark as Complete & Next"}
                                    </span>
                                </button>
                            </div>

                            {/* lesson content */}
                            {currentLesson.content && (
                                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                    <h3 className="font-bold text-white mb-2">Lesson Notes & Resources</h3>
                                    {currentLesson.content}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            No lecture selected.
                        </div>
                    )}
                </div>

                {/* right side curriculum and quiz sidebar */}
                <div
                    className={`w-full lg:w-96 rounded-3xl border border-slate-800 bg-slate-900/95 p-4 flex flex-col h-fit ${sidebarOpen ? "block" : "hidden lg:block"
                        }`}
                >
                    <div className="pb-3 mb-2 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
                        Course Curriculum
                    </div>

                    <div className="divide-y divide-slate-800/60 space-y-1">
                        {lessons.map((lesson, idx) => {
                            const isSelected = currentLessonIndex === idx;
                            const isCompleted = completedLessons.has(lesson.id || idx);

                            return (
                                <button
                                    key={lesson.id || idx}
                                    onClick={() => {
                                        setCurrentLessonIndex(idx);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full p-3.5 rounded-xl flex items-start justify-between text-left transition ${isSelected
                                            ? "bg-indigo-950/70 border border-indigo-500/50"
                                            : "hover:bg-slate-800/40"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {isCompleted ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>
                                                {idx + 1}. {lesson.title}
                                            </p>
                                            {lesson.duration && (
                                                <p className="text-[11px] text-slate-500 mt-0.5">{lesson.duration}</p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {quizzes.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
                                <FileQuestion className="w-4 h-4" /> Auto-Graded Assessments
                            </span>
                            <div className="space-y-2">
                                {quizzes.map((quiz, idx) => (
                                    <Link
                                        key={quiz.id || idx}
                                        href={`/courses/${slug}/quiz/${quiz.id || idx + 1}`}
                                        className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition group"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                                                Quiz {idx + 1}: {quiz.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400">Score instant grades</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CourseLearningPlayer;