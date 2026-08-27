"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    Loader2,
    Lock,
    ShieldAlert,
    BookOpen,
    Sparkles
} from "lucide-react";

const CourseLearningPlayer = () => {
    const { slug } = useParams();
    const router = useRouter();
    const { user, role, token, loading: authLoading } = useAuth();

    const [course, setCourse] = useState(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [enrollmentDocId, setEnrollmentDocId] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Local storage cache key
    const storageKey = `sf_progress_${user?.id || user?.email || "guest"}_${slug}`;

    // 1. Load course details and verify enrollment status
    useEffect(() => {
        async function loadCourseAndEnrollment() {
            if (authLoading) return;

            // Redirect unauthenticated visitors to login
            if (!user && !token) {
                router.push(`/login?redirect=/courses/${slug}/learn`);
                return;
            }

            try {
                // Fetch course curriculum
                const res = await fetchAPI(`/courses?filters[slug][$eq]=${slug}&populate=*`);
                const courses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

                if (courses.length > 0) {
                    const foundCourse = courses[0];
                    setCourse(foundCourse);

                    // Admins, Content Managers, and the Course Instructor have staff bypass
                    const userRole = (role || "").toLowerCase();
                    const isStaffOrInstructor =
                        userRole.includes("admin") ||
                        userRole.includes("manager") ||
                        userRole.includes("instructor");

                    const courseDocId = foundCourse.documentId || foundCourse.id;

                    // Query student enrollment from Strapi
                    try {
                        const enrollRes = await fetchAPI(
                            `/enrollments?filters[student][id][$eq]=${user.id}&filters[course][documentId][$eq]=${courseDocId}&populate[0]=completedLessons`,
                            { token }
                        );
                        const enrollments = Array.isArray(enrollRes?.data) ? enrollRes.data : Array.isArray(enrollRes) ? enrollRes : [];

                        if (enrollments.length > 0) {
                            const currentEnrollment = enrollments[0];
                            setIsEnrolled(true);
                            setEnrollmentDocId(currentEnrollment.documentId);

                            const remoteCompleted = new Set(
                                (currentEnrollment.completedLessons || []).map((l) => l.id || l.documentId)
                            );

                            if (remoteCompleted.size > 0) {
                                setCompletedLessons(remoteCompleted);
                                localStorage.setItem(storageKey, JSON.stringify(Array.from(remoteCompleted)));
                            }
                        } else if (isStaffOrInstructor) {
                            // Staff bypass allows course preview even without enrollment
                            setIsEnrolled(true);
                        } else {
                            setIsEnrolled(false);
                        }
                    } catch (enrollErr) {
                        console.warn("Could not fetch remote enrollment progress:", enrollErr);
                        if (isStaffOrInstructor) {
                            setIsEnrolled(true);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load course details:", err);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            loadCourseAndEnrollment();
        }
    }, [slug, user, token, role, authLoading, router, storageKey]);

    // 2. Restore cached progress from localStorage if present
    useEffect(() => {
        if (!slug || !isEnrolled) return;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved && completedLessons.size === 0) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCompletedLessons(new Set(parsed));
                }
            }
        } catch (e) {
            console.error("Failed to restore progress from cache:", e);
        }
    }, [slug, isEnrolled, storageKey, completedLessons.size]);

    // 3. Handle 1-Click Instant Enrollment on the Lock Screen
    const handleInstantEnroll = async () => {
        if (!user || !token || !course) {
            router.push(`/login?redirect=/courses/${slug}/learn`);
            return;
        }

        setEnrolling(true);
        try {
            const courseDocId = course.documentId || course.id;
            const res = await fetchAPI("/enrollments", {
                method: "POST",
                token: token,
                body: {
                    data: {
                        student: user.id,
                        course: courseDocId,
                        progress: 0,
                        isCompleted: false,
                        completedLessons: [],
                    },
                },
            });

            if (res?.data?.documentId) {
                setEnrollmentDocId(res.data.documentId);
            }
            setIsEnrolled(true);
        } catch (err) {
            console.error("Enrollment failed:", err);
            alert(err?.message || "Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    };

    // 4. Toggle lesson completion and sync with Strapi
    const toggleCompleteAndNext = async (lessonIdentifier) => {
        const updated = new Set(completedLessons);
        if (updated.has(lessonIdentifier)) {
            updated.delete(lessonIdentifier);
        } else {
            updated.add(lessonIdentifier);
        }

        setCompletedLessons(updated);

        try {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(updated)));
        } catch (e) {
            console.error("Failed to save progress locally:", e);
        }

        const lessons = course?.lessons || [];
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex((prev) => prev + 1);
        }

        if (user?.id && token && course) {
            const progressPct = lessons.length > 0 ? Math.round((updated.size / lessons.length) * 100) : 0;
            const completedLessonRelations = Array.from(updated).filter((id) => id && !String(id).startsWith("temp-"));
            const courseDocId = course.documentId || course.id;

            const enrollmentPayload = {
                data: {
                    student: user.id,
                    course: courseDocId,
                    completedLessons: completedLessonRelations,
                    progress: progressPct,
                    isCompleted: progressPct >= 100,
                },
            };

            try {
                if (enrollmentDocId) {
                    await fetchAPI(`/enrollments/${enrollmentDocId}`, {
                        method: "PUT",
                        token: token,
                        body: enrollmentPayload,
                    });
                } else {
                    const newEnroll = await fetchAPI("/enrollments", {
                        method: "POST",
                        token: token,
                        body: enrollmentPayload,
                    });
                    if (newEnroll?.data?.documentId) {
                        setEnrollmentDocId(newEnroll.data.documentId);
                    }
                }
            } catch (syncErr) {
                console.warn("Enrollment progress sync failed:", syncErr);
            }
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
                <p className="text-slate-600 dark:text-slate-400 font-semibold">Course curriculum not found.</p>
                <Link href="/dashboard/student" className="text-xs font-bold text-indigo-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }


    // ENROLLMENT GATE LOCK SCREEN (Shown when student is NOT enrolled)

    if (!isEnrolled) {
        const thumbnail =
            course.thumbnailUrl ||
            course.thumbnail?.url ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

        return (
            <div className="min-h-screen py-12 md:py-20 flex items-center justify-center px-4 sm:px-6">
                <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
                    
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image src={thumbnail} alt={course.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                                <Lock className="w-7 h-7" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            Enrollment Required
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            You must be enrolled in this course to access lectures, track progress, and attempt assessments.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={handleInstantEnroll}
                            disabled={enrolling}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                        >
                            {enrolling ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            <span>{enrolling ? "Enrolling..." : "Enroll in Course (Free)"}</span>
                        </button>

                        <Link
                            href={`/courses/${slug}`}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Course Overview</span>
                        </Link>
                    </div>

                </div>
            </div>
        );
    }


    // FULL COURSE LEARNING PLAYER (When enrolled / authorized)

    const lessons = course.lessons || [];
    const quizzes = course.quizzes || [];
    const currentLesson = lessons[currentLessonIndex] || null;

    const progressPercentage =
        lessons.length > 0 ? Math.round((completedLessons.size / lessons.length) * 100) : 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">

            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/student"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                            Learning Track
                        </span>
                        <h1 className="text-sm font-bold text-slate-100 truncate max-w-[200px] sm:max-w-md">
                            {course.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-indigo-400">{progressPercentage}%</span>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Main Player + Sidebar Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* Left: Video Player & Lecture Notes */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    {currentLesson ? (
                        <div className="max-w-4xl mx-auto space-y-6">

                            {/* Video Container */}
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                                {currentLesson.videoUrl ? (
                                    currentLesson.videoUrl.includes("youtube.com") || currentLesson.videoUrl.includes("youtu.be") ? (
                                        <iframe
                                            src={
                                                currentLesson.videoUrl.includes("watch?v=")
                                                    ? currentLesson.videoUrl.replace("watch?v=", "embed/")
                                                    : currentLesson.videoUrl.replace("youtu.be/", "www.youtube.com/embed/")
                                            }
                                            title={currentLesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full border-0"
                                        />
                                    ) : (
                                        <video
                                            src={currentLesson.videoUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                        <Play className="w-12 h-12 mb-2 stroke-1" />
                                        <p className="text-xs">No video lecture attached to this topic.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Title and Completion Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400">
                                        Lesson {currentLessonIndex + 1} of {lessons.length}
                                    </span>
                                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                                        {currentLesson.title}
                                    </h2>
                                    {currentLesson.duration && (
                                        <p className="text-xs text-slate-400 mt-1">Duration: {currentLesson.duration}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => toggleCompleteAndNext(currentLesson.id || currentLesson.documentId)}
                                    className={`px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 shadow-sm ${
                                        completedLessons.has(currentLesson.id || currentLesson.documentId)
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                    }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>
                                        {completedLessons.has(currentLesson.id || currentLesson.documentId)
                                            ? "Completed (Click to Unmark)"
                                            : "Mark as Complete & Next"}
                                    </span>
                                </button>
                            </div>

                            {/* Lesson Text Notes */}
                            {currentLesson.content && (
                                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                                    <h3 className="text-sm font-bold text-slate-200">Lecture Notes & Summary</h3>
                                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                        {currentLesson.content}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-400">No lessons available in this track.</p>
                        </div>
                    )}
                </main>

                {/* Right: Curriculum Sidebar */}
                <aside
                    className={`fixed inset-y-16 right-0 w-80 bg-slate-900 border-l border-slate-800 z-20 overflow-y-auto transform transition-transform duration-300 lg:static lg:translate-x-0 ${
                        sidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="p-5 border-b border-slate-800">
                        <h3 className="font-bold text-sm text-white">Course Syllabus</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {completedLessons.size} of {lessons.length} lectures completed
                        </p>
                    </div>

                    <div className="p-3 space-y-1">
                        {lessons.map((lesson, idx) => {
                            const isSelected = idx === currentLessonIndex;
                            const isDone = completedLessons.has(lesson.id || lesson.documentId);

                            return (
                                <button
                                    key={lesson.id || lesson.documentId || idx}
                                    onClick={() => {
                                        setCurrentLessonIndex(idx);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full p-3 rounded-2xl text-left transition flex items-start gap-3 ${
                                        isSelected
                                            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                                            : "hover:bg-slate-800/60 text-slate-300"
                                    }`}
                                >
                                    <div className="mt-0.5">
                                        {isDone ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        ) : isSelected ? (
                                            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-slate-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate leading-tight">
                                            {idx + 1}. {lesson.title}
                                        </p>
                                        {lesson.duration && (
                                            <span className="text-[10px] text-slate-500">{lesson.duration}</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        {/* Quizzes List */}
                        {quizzes.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
                                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Knowledge Check
                                </span>
                                {quizzes.map((quiz) => (
                                    <Link
                                        key={quiz.id || quiz.documentId}
                                        href={`/courses/${slug}/quiz/${quiz.id || quiz.documentId}`}
                                        className="w-full p-3 rounded-2xl bg-purple-950/30 hover:bg-purple-950/60 border border-purple-800/40 text-purple-300 transition flex items-center justify-between text-xs font-bold"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileQuestion className="w-4 h-4 text-purple-400" />
                                            <span className="truncate">{quiz.title || "Course Quiz"}</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default CourseLearningPlayer;
