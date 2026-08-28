"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Layers,
  FileEdit,
  BarChart3
} from "lucide-react";

export default function AboutUsPage() {
  const [openFaq, setOpenFaq] = useState(0); // first item open by default

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const corePillars = [
    {
      icon: Code2,
      color: "indigo",
      title: "Hands-on Technical Mastery",
      description:
        "Learn by building production-ready architectures. Our curated curriculum tracks emphasize deep understanding through structured lessons, code walk-throughs, and real-world implementation patterns.",
    },
    {
      icon: Zap,
      color: "amber",
      title: "Adaptive Progress Engine",
      description:
        "Never lose your momentum. SkillFlow automatically synchronizes your lecture milestones, marks lessons completed, and calculates real-time course progress saved seamlessly across devices.",
    },
    {
      icon: ShieldCheck,
      color: "purple",
      title: "4-Role Enterprise Ecosystem",
      description:
        "Tailored environments for every learning persona. From Students gaining new skills, to Instructors building curricula, Editorial Managers publishing articles, and Admins governing platform RBAC.",
    },
    {
      icon: BarChart3,
      color: "teal",
      title: "Interactive MCQ Auto-Grading",
      description:
        "Validate knowledge immediately with built-in timed assessments. Students receive instant scores, detailed answer evaluations, and historical performance tracking stored in their profile.",
    },
  ];

  const stats = [
    { value: "100%", label: "Curated Tech Tracks", sub: "Production-grade topics" },
    { value: "4 Roles", label: "Enterprise RBAC", sub: "Student, Instructor, Manager, Admin" },
    { value: "Instant", label: "Quiz Auto-Grading", sub: "Immediate score feedback" },
    { value: "1-Click", label: "Seamless Enrollment", sub: "Zero barrier to start" },
  ];

  const faqs = [
    {
      question: "How does course enrollment work on SkillFlow?",
      answer:
        "Browsing courses is open to all visitors. Once you log in as a Student, you can enroll in any track with 1 click from the course detail page or directly inside the course player. All your enrolled courses appear organized in your 'My Learning' dashboard.",
    },
    {
      question: "What are the 4 user roles and how do their permissions differ?",
      answer:
        "SkillFlow features a strict 4-role permission architecture: (1) Admin has platform-wide authority to manage users, assign roles, and govern curricula; (2) Content Manager creates and edits all courses, lessons, and publishes blog posts; (3) Instructor authors and manages their own course tracks, quizzes, and views enrolled learner progress; (4) Student enrolls in courses, watches sequential lectures, takes quizzes, and tracks personal progress.",
    },
    {
      question: "How does the quiz assessment and auto-grading work?",
      answer:
        "Instructors and Content Managers attach Multiple Choice Questions (MCQs) with options and correct answers to each course. When a student completes the timed quiz, SkillFlow's grading engine instantly calculates their score percentage, provides a pass/fail summary, and records the submission in their learning history.",
    },
    {
      question: "Can I preview lectures before deciding to enroll in a course?",
      answer:
        "Yes! Instructors and Managers can flag specific introductory lectures as 'Free Preview / Trial Lectures'. These preview lectures are accessible to explore the teaching style before enrolling in the full curriculum track.",
    },
    {
      question: "How is my lesson progress tracked and saved?",
      answer:
        "As you complete lectures, click 'Mark as Complete & Next'. SkillFlow instantly updates your course percentage in the top bar and persists your progress to the backend database as well as your local session cache, ensuring your completion status stays accurate across page refreshes.",
    },
    {
      question: "Can I publish articles or technical tutorials on SkillFlow?",
      answer:
        "Content Managers and Platform Administrators have full access to our Markdown Editorial Studio, enabling them to draft, live-preview, upload cover photography, and publish high-quality technical guides for the public community.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background ambient glowing gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Transforming Modern Tech Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Empowering Developers to Master{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
              High-Impact Tech Skills
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SkillFlow is a next-generation learning management ecosystem built for modern developers, instructors, and editorial creators. Combining sequential video learning, instant quiz assessments, and enterprise role-based governance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/20 transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Course Tracks</span>
            </Link>
            <Link
              href="/blogs"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold text-sm transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>Read Tech Articles</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATS & METRICS */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION & CORE PILLARS */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why SkillFlow
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Architected for Real-World Learning
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Everything in SkillFlow is designed to maximize knowledge retention, streamline instructional workflows, and uphold strict enterprise security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition group space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. FOUR-ROLE WORKSPACE HIGHLIGHTS */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              User Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A Tailored Hub for Every Role
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access is strictly segmented to ensure clean separation of authoring, administration, and learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Student */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Student Portal</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enroll in tracks, watch sequential video lectures, take timed MCQ quizzes, and view personal progress percentages.
              </p>
            </div>

            {/* Instructor */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Instructor Studio</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Author and publish personalized curricula, configure quizzes with auto-grading, and monitor enrolled student engagement.
              </p>
            </div>

            {/* Manager */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <FileEdit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Editorial Studio</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Govern course tracks across the catalog, draft and publish rich Markdown tech articles, and manage publication states.
              </p>
            </div>

            {/* Admin */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Admin Console</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Platform-wide authority: Inspect operational metrics, promote or reassign user roles, and govern content across all disciplines.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE FAQ SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Got Questions? We’ve Got Answers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Find quick answers to common questions about enrollment, role permissions, quizzes, and learning with SkillFlow.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600" : "text-slate-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) BANNER */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 border border-indigo-800/50 p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Start Learning Today
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Upgrade Your Tech Skills?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join our curriculum tracks today. Experience sequential learning, timed skill assessments, and industry-focused coursework.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
              >
                Browse All Courses
              </Link>
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
