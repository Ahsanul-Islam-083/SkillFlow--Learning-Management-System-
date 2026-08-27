"use client";

import { useState } from "react";
import {
    Plus,
    Trash2,
    FileQuestion,
    Check,
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";

const QuizBuilder = ({ quizzes = [], onChange = () => { } }) => {
    const quizList = Array.isArray(quizzes) ? quizzes : [];

    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [activeQuizIndex, setActiveQuizIndex] = useState(null);

    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
    });

    // add quiz
    const handleAddQuiz = (e) => {
        e.preventDefault();
        if (!newQuizTitle.trim()) return;

        const updated = [
            ...quizList,
            {
                id: `temp-${Date.now()}`,
                isNew: true,
                title: newQuizTitle,
                passingScore: 60,
                questions: [],
            },
        ];

        onChange(updated);
        setNewQuizTitle("");
        setShowAddQuiz(false);
        setActiveQuizIndex(quizList.length);
    };

   
    const handleRemoveQuiz = (quizIdx) => {
        const updated = quizList.filter((_, idx) => idx !== quizIdx);
        onChange(updated);
        if (activeQuizIndex === quizIdx) setActiveQuizIndex(null);
    };

    // ৩. MCQ option change
    const handleOptionChange = (optIdx, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[optIdx] = value;
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    // add question to quiz
    const handleAddQuestionToQuiz = (e) => {
        e.preventDefault();
        const text = (newQuestion.questionText || "").trim();
        if (!text) return;
        if (newQuestion.options.some((opt) => !opt.trim())) {
            alert("Please fill all 4 options.");
            return;
        }

        const updated = [...quizList];
        const targetQuiz = updated[activeQuizIndex];
        if (!targetQuiz.questions) targetQuiz.questions = [];

        targetQuiz.questions.push({
            id: `q-${Date.now()}`,
            questionText: text,
            options: [...newQuestion.options],
            correctAnswerIndex: Number(newQuestion.correctAnswerIndex || 0),
        });

        onChange(updated);
        setNewQuestion({
            questionText: "",
            options: ["", "", "", ""],
            correctAnswerIndex: 0,
        });
        setShowAddQuestion(false);
    };


    const handleRemoveQuestion = (quizIdx, qIdx) => {
        const updated = [...quizList];
        updated[quizIdx].questions = updated[quizIdx].questions.filter((_, idx) => idx !== qIdx);
        onChange(updated);
    };

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">


            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <FileQuestion className="w-5 h-5 text-amber-500" />
                        MCQ Quizzes & Assessments
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {quizList.length} assessment(s) configured for auto-grading
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAddQuiz(!showAddQuiz)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition"
                >
                    <Plus className="w-4 h-4" /> Create New Quiz
                </button>
            </div>

         
            {showAddQuiz && (
                <form onSubmit={handleAddQuiz} className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        New Quiz Title
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            required
                            placeholder="e.g. Assessment 1: Fundamentals of React"
                            value={newQuizTitle}
                            onChange={(e) => setNewQuizTitle(e.target.value)}
                            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                            Create Quiz
                        </button>
                    </div>
                </form>
            )}

           
            <div className="space-y-4">
                {quizList.map((quiz, quizIdx) => {
                    const isExpanded = activeQuizIndex === quizIdx;
                    const qCount = quiz.questions?.length || 0;

                    return (
                        <div
                            key={quiz.documentId || quiz.id || quizIdx}
                            className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="p-4 flex items-center justify-between bg-slate-100/60 dark:bg-slate-900/60">
                                <button
                                    type="button"
                                    onClick={() => setActiveQuizIndex(isExpanded ? null : quizIdx)}
                                    className="flex items-center gap-3 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex-1"
                                >
                                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center text-xs">
                                        Q{quizIdx + 1}
                                    </span>
                                    <span>{quiz.title}</span>
                                    <span className="text-xs font-normal text-slate-400">({qCount} Questions)</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto mr-2" /> : <ChevronDown className="w-4 h-4 ml-auto mr-2" />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveQuiz(quizIdx)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="p-5 space-y-4 border-t border-slate-200 dark:border-slate-800">
                                    
                                    {quiz.questions && quiz.questions.length > 0 ? (
                                        <div className="space-y-3">
                                            {quiz.questions.map((q, qIdx) => {
                                                const questionTitle = q.questionText || q.question || "";
                                                const correctIdx = q.correctAnswerIndex ?? q.correctAnswer ?? 0;

                                                return (
                                                    <div
                                                        key={q.id || qIdx}
                                                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="font-bold text-slate-900 dark:text-white">
                                                                {qIdx + 1}. {questionTitle}
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveQuestion(quizIdx, qIdx)}
                                                                className="text-slate-400 hover:text-red-500 transition"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                            {q.options?.map((opt, optIdx) => (
                                                                <div
                                                                    key={optIdx}
                                                                    className={`p-2 rounded-lg border flex items-center justify-between ${correctIdx === optIdx
                                                                            ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                                                                            : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                                                        }`}
                                                                >
                                                                    <span>{opt}</span>
                                                                    {correctIdx === optIdx && (
                                                                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No MCQ questions added to this quiz yet.</p>
                                    )}

                                    {/* Add New Question Form */}
                                    {showAddQuestion ? (
                                        <form onSubmit={handleAddQuestionToQuiz} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-teal-500/40 space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                                Add New MCQ Question
                                            </h4>

                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Question Title *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Which hook is used for lifecycle operations?"
                                                    value={newQuestion.questionText}
                                                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                                    className="mt-1 w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                                    Options & Correct Answer:
                                                </label>

                                                {newQuestion.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswerOption"
                                                            checked={Number(newQuestion.correctAnswerIndex) === optIdx}
                                                            onChange={() => setNewQuestion({ ...newQuestion, correctAnswerIndex: optIdx })}
                                                            className="w-4 h-4 text-teal-600 cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder={`Option ${optIdx + 1}`}
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                                                            className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddQuestion(false)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                                                >
                                                    Save Question
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddQuestion(true)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Question to Quiz
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default QuizBuilder;
