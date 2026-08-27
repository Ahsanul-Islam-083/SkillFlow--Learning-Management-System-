"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Lock, FileQuestion, Video, X } from "lucide-react";

const CourseSyllabus = ({ lessons = [], quizzes = [] }) => {
    const [openSections, setOpenSections] = useState({ lessons: true, quizzes: true });
    const [previewVideo, setPreviewVideo] = useState(null);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };
return (
    <div className="space-y-4">
      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {previewVideo.title} (Trial Lecture)
              </h4>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {previewVideo.videoUrl?.includes("youtube") || previewVideo.videoUrl?.includes("youtu.be") ? (
                <iframe
                  src={previewVideo.videoUrl.replace("watch?v=", "embed/")}
                  title={previewVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video src={previewVideo.videoUrl} controls autoPlay className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lesson Curriculum Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection("lessons")}
          className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white text-sm"
        >
          <span className="flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Curriculum Lectures ({lessons.length})
          </span>
          {openSections.lessons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.lessons && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {lessons.length > 0 ? (
              lessons.map((lesson, idx) => (
                <div
                  key={lesson.id || idx}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 w-5">
                      {idx + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {lesson.title}
                      </p>
                      {lesson.duration && (
                        <p className="text-xs text-slate-400 mt-0.5">{lesson.duration}</p>
                      )}
                    </div>
                  </div>

                  {lesson.isPreview || lesson.isTrial || lesson.isFreePreview ? (
                    <button
                      onClick={() => setPreviewVideo(lesson)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 transition"
                    >
                      <Play className="w-3 h-3 fill-current" /> Preview
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-xs text-slate-400">Lectures are being structured for this track.</p>
            )}
          </div>
        )}
      </div>

      {/* Assessment & Quiz Section */}
      {quizzes.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("quizzes")}
            className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white text-sm"
          >
            <span className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-amber-500" />
              Assessments & Quizzes ({quizzes.length})
            </span>
            {openSections.quizzes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.quizzes && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {quizzes.map((quiz, idx) => (
                <div key={quiz.id || idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 w-5">Q{idx + 1}.</span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {quiz.title}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Auto-Graded</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSyllabus;