import Link from "next/link";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";

const RoleCta = () => {
return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              For Learners
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Start Your Journey Today
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100 max-w-sm">
              Enroll in top tech tracks, test your skills with auto-graded quizzes, and track real-time progress.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition shadow-sm"
            >
              Sign Up Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

       
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              For Educators
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Teach & Inspire on SkillFlow
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-sm">
              Build modern curricula, manage lesson content, design quizzes, and monitor enrolled student analytics.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition shadow-sm"
            >
              Instructor Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleCta;