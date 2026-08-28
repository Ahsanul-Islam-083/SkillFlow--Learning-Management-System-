import Link from "next/link";
import { Sparkles, ArrowRight, PlayCircle, Users, GraduationCap, Award } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800/80">
         
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Next-Gen Full Stack Learning Ecosystem</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                    Master In-Demand Tech Skills with{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 dark:from-indigo-400 dark:via-teal-300 dark:to-teal-400">
                        SkillFlow
                    </span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Interactive video curricula, auto-graded quizzes, and personalized role workflows designed for students, instructors, and tech leaders.
                </p>

              
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
                    <Link 
                        href="/courses" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/20"
                    >
                        Explore Courses <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition shadow-2xs"
                    >
                        <PlayCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Join for Free
                    </Link>
                </div>

           
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto mb-2">
                            <Users className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12,500+</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Learners</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto mb-2">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">98.4%</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Course Completion</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto mb-2">
                            <Award className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">50+ Tracks</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Expert Curricula</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
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