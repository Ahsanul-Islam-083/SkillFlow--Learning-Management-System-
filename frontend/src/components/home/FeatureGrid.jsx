import { Video, Award, CheckCircle2, ShieldCheck } from "lucide-react";

const FeatureGrid = () => {
const features = [
    {
      icon: Video,
      title: "Interactive Video Player",
      desc: "Structured lesson modules with synchronized syllabus drawer and trial lectures.",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
    },
    {
      icon: CheckCircle2,
      title: "Live Progress Tracking",
      desc: "Instant course completion status synced dynamically upon completing every lesson.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      icon: Award,
      title: "Instant Auto-Graded Quizzes",
      desc: "Test your understanding with automated timers, immediate scores, and answer reviews.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Flexibility",
      desc: "Tailored dashboards for Students, Instructors, Content Managers, and Administrators.",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/60",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Why SkillFlow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Engineered for Modern Learning
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            High-performance LMS architecture built for seamless student progression and straightforward instructor authoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;