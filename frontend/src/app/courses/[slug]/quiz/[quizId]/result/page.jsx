"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Layers } from "lucide-react";

const QuizResultPage = () => {
    const { slug, quizId } = useParams();
    const router = useRouter();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(`quiz_result_${quizId}`);
        if (saved) {
            setResult(JSON.parse(saved));
        }
    }, [quizId]);

    if (!result) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <p className="text-slate-500">No recent result found for this assessment.</p>
                <Link href={`/courses/${slug}/learn`} className="mt-4 text-xs font-bold text-indigo-600 underline">
                    Return to Course
                </Link>
            </div>
        );
    }

    const isPassed = result.percentage >= 60;

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

                {/* Result Summary Card */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${isPassed
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                        }`}>
                        <Award className="w-8 h-8" />
                    </div>

                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${isPassed
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200"
                        }`}>
                        {isPassed ? "Passed Successfully" : "Needs Improvement"}
                    </span>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        Score: {result.percentage}%
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        You scored {result.score} out of {result.totalQuestions} questions correctly.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                        <Link
                            href={`/courses/${slug}/quiz/${quizId}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                        >
                            <RotateCcw className="w-4 h-4" /> Retake Quiz
                        </Link>
                        <Link
                            href={`/courses/${slug}/learn`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Continue Course
                        </Link>
                    </div>
                </div>

                {/* Detailed Question Breakdown */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Detailed Question Breakdown
                    </h2>

                    {result.questions?.map((q, idx) => {
                        const userAns = result.selectedAnswers[idx];
                        const isCorrect = userAns === q.correctAnswer;

                        return (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                        {idx + 1}. {q.question}
                                    </h3>
                                    {isCorrect ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="w-4 h-4" /> Correct
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                                            <XCircle className="w-4 h-4" /> Incorrect
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                                        <span className="text-slate-400 block mb-0.5">Your Choice:</span>
                                        <span className={`font-semibold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                                            {userAns !== undefined ? q.options[userAns] : "Not Answered"}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                                        <span className="text-slate-400 block mb-0.5">Correct Answer:</span>
                                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                            {q.options[q.correctAnswer]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default QuizResultPage;