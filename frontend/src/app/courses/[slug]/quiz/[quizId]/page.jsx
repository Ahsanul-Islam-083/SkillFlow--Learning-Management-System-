"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Clock, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

const LiveQuizPage = () => {
    const { slug, quizId } = useParams();
    const router = useRouter();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        async function loadQuizData() {
            try {
                const res = await fetchAPI(`/courses?filters[slug][$eq]=${slug}&populate[quizzes][populate]=*`);
                const courses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (courses.length > 0 && courses[0].quizzes) {
                    const found = courses[0].quizzes.find((q) => String(q.id) === String(quizId)) || courses[0].quizzes[0];
                    setQuiz(found);
                }
            } catch (err) {
                console.error("Failed to load quiz:", err);
            } finally {
                setLoading(false);
            }
        }
        if (slug) loadQuizData();
    }, [slug, quizId]);

    // timer effect for countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const questions = quiz?.questions || [
        {
            id: 1,
            question: "Which hook is used for side-effects in React?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: 1,
        },
        {
            id: 2,
            question: "What is Next.js primary rendering mode for SEO?",
            options: ["Client Side Rendering", "Server Side Rendering", "Pure Static", "WebGL"],
            correctAnswer: 1,
        }
    ];

    const handleSelectOption = (qIdx, optIdx) => {
        setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    };

    const handleSubmitQuiz = () => {
        // score calculation based on selected answers
        let score = 0;
        questions.forEach((q, idx) => {
            const correctIndex = q.correctAnswerIndex ?? q.correctAnswer ?? 0;
            if (selectedAnswers[idx] === correctIndex) {
                score += 1;
            }
        });

        const resultData = {
            quizTitle: quiz?.title || "Course Assessment",
            totalQuestions: questions.length,
            score: score,
            percentage: Math.round((score / questions.length) * 100),
            selectedAnswers,
            questions,
        };

        // store results in local storage and redirect to results page
        localStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(resultData));
        router.push(`/courses/${slug}/quiz/${quizId}/result`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const questionText = currentQ?.questionText || currentQ?.question || "Assessment Question";

    return (
        <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

                {/* quiz header and timer */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Live Quiz Examination
                        </span>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {quiz?.title || "Assessment"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                    </div>
                </div>

                {/* question and option card */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>Auto-Grading Enabled</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {questionText}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((opt, optIdx) => {
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

                    {/* navigation and submit button */}
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
                        ) : (
                            <button
                                onClick={handleSubmitQuiz}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                            >
                                Submit Assessment
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LiveQuizPage;