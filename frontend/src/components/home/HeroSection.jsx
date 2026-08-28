"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Users, GraduationCap, Award, Check } from "lucide-react";
import SkillFlowHeroMatrix from "@/components/common/SkillFlowHeroMatrix";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 dark:border-slate-800/80">
      {/* 🔮 Ambient Background Light Spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-cyan-500/10 dark:bg-cyan-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 🚀 2-Column Developer Hero Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          
          {/* 🌟 Left Column: Value Proposition & CTAs */}
          <div className="space-y-6 text-left">
            
            {/* Ping Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span>Engineered for Modern Developers</span>
            </div>

            {/* Main Title with Cyan/Indigo Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Elevate Your Code with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-cyan-500 to-teal-400 dark:from-indigo-400 dark:via-cyan-300 dark:to-teal-400">
                SkillFlow
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Master full-stack engineering, cloud architecture, and modern DevOps through interactive code challenges, verified video curricula, and instant MCQ auto-graded assessments.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 hover:shadow-cyan-500/25 group"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Create Free Account</span>
              </Link>
            </div>

            {/* Feature Checkpoints */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Zero Configuration
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Real-World Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Verified Certificates
              </span>
            </div>
          </div>

          {/* 💻 Right Column: Interactive Code Studio Matrix */}
          <div className="w-full flex justify-center">
            <SkillFlowHeroMatrix />
          </div>
        </div>

        {/* 📊 Metrics & Ecosystem Counter Bar */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12,500+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Learners</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto mb-2">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">98.4%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Course Completion</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto mb-2">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">50+ Tracks</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Expert Curricula</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto mb-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Instant</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quiz Auto-Grading</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;