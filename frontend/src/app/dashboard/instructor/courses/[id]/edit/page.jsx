"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import QuizBuilder from "@/components/dashboard/QuizBuilder";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Layers
} from "lucide-react";

const EditCoursePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [deletedLessonIds, setDeletedLessonIds] = useState([]);
  const [deletedQuizIds, setDeletedQuizIds] = useState([]);
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

  // load course details, lessons, and quizzes
  const loadCourse = async () => {
    if (!id) return;
    try {
      const isNumeric = /^\d+$/.test(id);
      const populateParam = "populate[0]=lessons&populate[1]=quizzes&populate[2]=quizzes.questions";
      const filterQuery = isNumeric
        ? `/courses?filters[$or][0][id][$eq]=${id}&filters[$or][1][documentId][$eq]=${id}&filters[$or][2][slug][$eq]=${id}&${populateParam}`
        : `/courses?filters[$or][0][documentId][$eq]=${id}&filters[$or][1][slug][$eq]=${id}&${populateParam}`;

      let data = null;
      try {
        const res = await fetchAPI(filterQuery, { token });
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          data = list[0];
        }
      } catch (filterErr) {
        console.warn("Filtered course query failed, attempting direct fetch:", filterErr);
      }

      if (!data) {
        const singleRes = await fetchAPI(`/courses/${id}?${populateParam}`, { token });
        data = singleRes?.data || singleRes;
      }

      if (data && (data.id || data.documentId)) {
        setCourse(data);
        setLessons(data.lessons || []);
        setQuizzes(data.quizzes || []);
        setDeletedLessonIds([]);
        setDeletedQuizIds([]);
      }
    } catch (err) {
      console.error("Failed to load course details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id, token]);

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLesson.title.trim()) return;

    setLessons([...lessons, { ...newLesson, id: `temp-${Date.now()}`, isNew: true }]);
    setNewLesson({ title: "", videoUrl: "", duration: "10 mins", isPreview: false, content: "" });
    setShowAddLesson(false);
  };

  const handleRemoveLesson = (indexToRemove) => {
    const lessonToRemove = lessons[indexToRemove];
    if (lessonToRemove?.documentId) {
      setDeletedLessonIds((prev) => [...prev, lessonToRemove.documentId]);
    }
    setLessons(lessons.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQuizzesChange = (updatedQuizzes) => {
    // Detect if any existing quizzes with documentId were removed
    const currentDocIds = new Set(updatedQuizzes.filter((q) => q.documentId).map((q) => q.documentId));
    quizzes.forEach((q) => {
      if (q.documentId && !currentDocIds.has(q.documentId)) {
        setDeletedQuizIds((prev) => [...prev, q.documentId]);
      }
    });
    setQuizzes(updatedQuizzes);
  };

  // save changes to course, lessons, and quizzes
  const handleSaveChanges = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const targetCourseId = course.documentId || course.id || id;

      const normalizeLevel = (lvl) => {
        if (!lvl) return "Beginner";
        const lower = String(lvl).toLowerCase();
        if (lower === "intermediate") return "Intermediate";
        if (lower === "advanced") return "Advanced";
        return "Beginner";
      };

      // 1. Update course details in Strapi (without sending raw quizzes)
      await fetchAPI(`/courses/${targetCourseId}`, {
        method: "PUT",
        token: token,
        body: {
          data: {
            title: course.title,
            category: course.category || "Web Development",
            level: normalizeLevel(course.level),
            description: course.description,
          },
        },
      });

      // 2. Post new lessons to Strapi
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

      // 3. Delete removed lessons from Strapi
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

      // 4. Create or update quizzes in Strapi
      for (const quiz of quizzes) {
        const formattedQuestions = (quiz.questions || []).map((q) => ({
          questionText: q.questionText || q.question || "Assessment Question",
          options: q.options || [],
          correctAnswerIndex: Number(q.correctAnswerIndex ?? q.correctAnswer ?? 0),
          explanation: q.explanation || "",
        }));

        if (quiz.documentId) {
          // Update existing quiz
          await fetchAPI(`/quizzes/${quiz.documentId}`, {
            method: "PUT",
            token: token,
            body: {
              data: {
                title: quiz.title,
                passingScore: quiz.passingScore || 60,
                questions: formattedQuestions,
              },
            },
          });
        } else {
          // Create new quiz linked to course
          await fetchAPI("/quizzes", {
            method: "POST",
            token: token,
            body: {
              data: {
                title: quiz.title,
                passingScore: quiz.passingScore || 60,
                course: targetCourseId,
                questions: formattedQuestions,
              },
            },
          });
        }
      }

      // 5. Delete removed quizzes from Strapi
      for (const docId of deletedQuizIds) {
        try {
          await fetchAPI(`/quizzes/${docId}`, {
            method: "DELETE",
            token: token,
          });
        } catch (delQuizErr) {
          console.warn(`Failed to delete quiz ${docId}:`, delQuizErr);
        }
      }

      // 6. Reload fresh course data with lessons & quizzes
      await loadCourse();

      setStatus({ type: "success", message: "Course, curriculum & quizzes saved successfully!" });
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
            className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>

   
        {status.message && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Course Information */}
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

        {/* Quiz Builder */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-500" />
                Lectures & Modules
              </h2>
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

        {/* Quiz Builder */}
        <QuizBuilder
          quizzes={quizzes}
          onChange={handleQuizzesChange}
        />

      </div>
    </div>
  );
};

export default EditCoursePage;