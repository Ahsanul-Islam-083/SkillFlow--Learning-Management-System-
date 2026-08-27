"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import PageLoader from "@/components/common/PageLoader";
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Calendar } from "lucide-react";

export default function QuizResultPage() {
    const { slug, quizId } = useParams();
    const { user, token } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResult() {
            // 1. Try restoring from localStorage first
            const cached = localStorage.getItem(`quiz_result_${quizId}`);
            if (cached) {
                try {
                    setResult(JSON.parse(cached));
                    setLoading(false);
                    return;
                } catch (e) {
                    console.warn("Could not parse local quiz result:", e);
                }
            }

            // 2. Fetch persisted submission from Strapi if not in localStorage
            if (user?.id && token) {
                try {
                    const res = await fetchAPI(
                        `/quiz-submissions?filters[student][id][$eq]=${user.id}&populate=*&sort=createdAt:desc`,
                        { token }
                    );
                    const submissions = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                    
                    const match = submissions.find(
                        (s) =>
                            String(s.quiz?.documentId) === String(quizId) ||
                            String(s.quiz?.id) === String(quizId)
                    );

                    if (match) {
                        setResult({
                            quizTitle: match.quiz?.title || "Course Assessment",
                            percentage: match.score || 0,
                            isPassed: match.isPassed || (match.score || 0) >= 60,
                            submittedAt: match.createdAt,
                            selectedAnswers: match.userAnswers || {},
                            totalQuestions: match.quiz?.questions?.length || 0,
                            score: Math.round(((match.score || 0) / 100) * (match.quiz?.questions?.length || 1)),
                            questions: match.quiz?.questions || [],
                        });
                    }
                } catch (err) {
                    console.error("Failed to load persisted quiz submission:", err);
                }
            }
            setLoading(false);
        }

        loadResult();
    }, [quizId, user?.id, token]);

    if (loading) {
        return <PageLoader color="text-indigo-600 dark:text-indigo-400" message="Loading your assessment score..." minHeight="min-h-screen" />;
    }

    if (!result) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    No recent attempt found for this assessment.
                </p>
                <Link
                    href={`/courses/${slug}/quiz/${quizId}`}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition"
                >
                    Take Quiz Now
                </Link>
            </div>
        );
    }

    const isPassed = result.percentage >= 60 || result.isPassed;

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

                {/* Result Score Card */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                    <div
                        className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                            isPassed
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                        }`}
                    >
                        <Award className="w-8 h-8" />
                    </div>

                    <div>
                        <span
                            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                                isPassed
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                    : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800"
                            }`}
                        >
                            {isPassed ? "Passed Successfully" : "Needs Improvement"}
                        </span>
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Score: {result.percentage}%
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {result.totalQuestions
                            ? `You answered ${result.score} of ${result.totalQuestions} questions correctly.`
                            : "Assessment recorded and saved to your learner profile."}
                    </p>

                    {result.submittedAt && (
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Submitted on {new Date(result.submittedAt).toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                        <Link
                            href={`/courses/${slug}/quiz/${quizId}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            <RotateCcw className="w-4 h-4" /> Retake Quiz
                        </Link>

                        <Link
                            href={`/courses/${slug}/learn`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Return to Course Player
                        </Link>
                    </div>
                </div>

                {/* Question Breakdown Review */}
                {result.questions && result.questions.length > 0 && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Question Breakdown & Correct Answers
                        </h2>

                        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                            {result.questions.map((q, idx) => {
                                const correctIdx = q.correctAnswerIndex ?? q.correctAnswer ?? 0;
                                const userSelected = result.selectedAnswers?.[idx];
                                const isCorrect = userSelected === correctIdx;

                                return (
                                    <div key={idx} className="pt-4 first:pt-0 space-y-2">
                                        <div className="flex items-start gap-2">
                                            {isCorrect ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {idx + 1}. {q.questionText || q.question}
                                                </p>
                                                <div className="mt-1.5 space-y-1 text-xs">
                                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                        Correct Answer: {q.options?.[correctIdx]}
                                                    </p>
                                                    {!isCorrect && userSelected !== undefined && (
                                                        <p className="text-red-500 dark:text-red-400">
                                                            Your Answer: {q.options?.[userSelected]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
