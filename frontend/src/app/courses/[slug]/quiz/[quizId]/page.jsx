"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import PageLoader from "@/components/common/PageLoader";
import {
    Clock,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Award,
    RotateCcw,
    Calendar
} from "lucide-react";

export default function LiveQuizPage() {
    const { slug, quizId } = useParams();
    const router = useRouter();
    const { user, role, token } = useAuth();

    // Determine if user is staff (Instructor, Content Manager, Admin)
    const userRole = (role || "").toLowerCase();
    const isStaff =
        userRole.includes("admin") ||
        userRole.includes("manager") ||
        userRole.includes("instructor");

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300);

    // Previous submission tracking & upsert ID
    const [previousSubmission, setPreviousSubmission] = useState(null);
    const [previousSubmissionDocId, setPreviousSubmissionDocId] = useState(null);
    const [isRetaking, setIsRetaking] = useState(false);

    // 1. Fetch Quiz Data & Check Database for Previous Submissions
    useEffect(() => {
        async function loadQuizAndSubmission() {
            try {
                // A. Load Quiz Data
                const res = await fetchAPI(`/courses?filters[slug][$eq]=${slug}&populate[quizzes][populate]=*`);
                const courses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                let currentQuiz = null;

                if (courses.length > 0 && courses[0].quizzes) {
                    currentQuiz = courses[0].quizzes.find(
                        (q) => String(q.id) === String(quizId) || String(q.documentId) === String(quizId)
                    ) || courses[0].quizzes[0];
                    setQuiz(currentQuiz);
                }

                // B. Check Backend Database for Previous Student Submissions
                if (user?.id && token && currentQuiz) {
                    try {
                        const subRes = await fetchAPI(
                            `/quiz-submissions?filters[student][id][$eq]=${user.id}&populate=*&sort=createdAt:desc`,
                            { token }
                        );
                        const submissions = Array.isArray(subRes?.data) ? subRes.data : Array.isArray(subRes) ? subRes : [];

                        const matchedSubmission = submissions.find(
                            (s) =>
                                String(s.quiz?.documentId) === String(quizId) ||
                                String(s.quiz?.id) === String(quizId) ||
                                String(s.quiz?.documentId) === String(currentQuiz.documentId) ||
                                String(s.quiz?.id) === String(currentQuiz.id)
                        );

                        if (matchedSubmission) {
                            const docId = matchedSubmission.documentId || matchedSubmission.id;
                            setPreviousSubmissionDocId(docId);
                            setPreviousSubmission({
                                score: matchedSubmission.score || 0,
                                isPassed: matchedSubmission.isPassed || (matchedSubmission.score || 0) >= 60,
                                submittedAt: matchedSubmission.createdAt,
                                userAnswers: matchedSubmission.userAnswers || {},
                            });
                        }
                    } catch (subErr) {
                        console.warn("Could not fetch remote quiz submission history:", subErr);
                    }
                }
            } catch (err) {
                console.error("Failed to load quiz data:", err);
            } finally {
                setLoading(false);
            }
        }

        if (slug) loadQuizAndSubmission();
    }, [slug, quizId, user?.id, token]);

    // 2. Countdown Timer (Only runs for Students during active exam)
    useEffect(() => {
        if (isStaff || (previousSubmission && !isRetaking)) return;

        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isStaff, previousSubmission, isRetaking]);

    const questions = quiz?.questions || [];

    const handleSelectOption = (qIdx, optIdx) => {
        setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    };

    // 3. Grade Assessment & Persist (PUT on retake / POST on first attempt)
    const handleSubmitQuiz = async () => {
        if (submitting || isStaff) return;
        setSubmitting(true);

        let correctCount = 0;
        questions.forEach((q, idx) => {
            const correctIndex = q.correctAnswerIndex ?? q.correctAnswer ?? 0;
            if (selectedAnswers[idx] === correctIndex) {
                correctCount += 1;
            }
        });

        const totalQuestions = questions.length || 1;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const isPassed = percentage >= 60;

        const resultData = {
            quizTitle: quiz?.title || "Course Assessment",
            totalQuestions: questions.length,
            score: correctCount,
            percentage: percentage,
            isPassed: isPassed,
            selectedAnswers,
            questions,
            submittedAt: new Date().toISOString(),
        };

        // Cache locally
        localStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(resultData));

        // Persist to database in Strapi
        if (user?.id && token && quiz) {
            const quizDocId = quiz.documentId || quiz.id;
            try {
                if (previousSubmissionDocId) {
                    // Approach A: Update existing submission on retake (No duplicate rows)
                    await fetchAPI(`/quiz-submissions/${previousSubmissionDocId}`, {
                        method: "PUT",
                        token: token,
                        body: {
                            data: {
                                score: percentage,
                                isPassed: isPassed,
                                userAnswers: selectedAnswers,
                            },
                        },
                    });
                } else {
                    // Create initial submission
                    await fetchAPI("/quiz-submissions", {
                        method: "POST",
                        token: token,
                        body: {
                            data: {
                                score: percentage,
                                isPassed: isPassed,
                                userAnswers: selectedAnswers,
                                student: user.id,
                                quiz: quizDocId,
                            },
                        },
                    });
                }
            } catch (persistErr) {
                console.warn("Strapi quiz-submission sync failed:", persistErr);
            }
        }

        router.push(`/courses/${slug}/quiz/${quizId}/result`);
    };

    if (loading) {
        return (
            <PageLoader
                color="text-indigo-600 dark:text-indigo-400"
                message="Loading assessment..."
                minHeight="min-h-screen"
            />
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500" />
                <p className="text-slate-600 dark:text-slate-400 font-semibold">
                    No questions configured for this quiz.
                </p>
            </div>
        );
    }

    // --- PREVIOUS ATTEMPT SCREEN ---
    if (previousSubmission && !isRetaking) {
        const isPassed = previousSubmission.isPassed || previousSubmission.score >= 60;

        return (
            <div className="min-h-screen py-12 md:py-16 bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6">
                <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
                    <div
                        className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${isPassed
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                            }`}
                    >
                        <Award className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span
                                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${isPassed
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                    }`}
                            >
                                {isPassed ? "Completed & Passed" : "Attempt Recorded"}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {quiz.title}
                        </h1>

                        <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 pt-2">
                            Previous Score: {previousSubmission.score}%
                        </div>

                        {previousSubmission.submittedAt && (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Last taken on {new Date(previousSubmission.submittedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => {
                                setSelectedAnswers({});
                                setCurrentIndex(0);
                                setTimeLeft(300);
                                setIsRetaking(true);
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            <RotateCcw className="w-4 h-4" /> Retake Quiz
                        </button>

                        <Link
                            href={`/courses/${slug}/learn`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Return to Course Player
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- ACTIVE EXAM QUESTIONS SCREEN ---
    const currentQ = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const questionText = currentQ?.questionText || currentQ?.question || "Assessment Question";
    const options = currentQ?.options || [];

    return (
        <div className="min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

                {/* Header & Countdown */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                            Live Assessment Examination
                        </span>
                        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {quiz?.title || "Assessment"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs sm:text-sm w-fit">
                        <Clock className="w-4 h-4" />
                        <span>
                            {isStaff
                                ? "Timer Disabled (Staff Mode)"
                                : `Time Remaining: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                        </span>
                    </div>
                </div>

                {/* Question & Options Card */}
                <div className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span className="hidden sm:inline">Auto-Grading Synchronized</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {questionText}
                    </h2>

                    <div className="space-y-3">
                        {options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[currentIndex] === optIdx;

                            return (
                                <button
                                    key={optIdx}
                                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between ${isSelected
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                                        }`}
                                >
                                    <span>{opt}</span>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation & Submit Action */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((prev) => prev - 1)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30"
                        >
                            Previous
                        </button>

                        {currentIndex < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIndex((prev) => prev + 1)}
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                            >
                                Next Question <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        ) : isStaff ? (
                            <button
                                disabled
                                title="Staff members cannot submit quiz attempts"
                                className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-300 dark:border-slate-700 flex items-center gap-2"
                            >
                                <span>Submission Disabled (Staff Preview)</span>
                            </button>
                        ) : (
                            <button
                                disabled={submitting}
                                onClick={handleSubmitQuiz}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                <span>{submitting ? "Grading & Saving..." : "Submit Assessment"}</span>
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
