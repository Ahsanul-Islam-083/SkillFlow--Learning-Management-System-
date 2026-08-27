import Link from "next/link";
import Image from "next/image";
import { BookOpen, Layers, ArrowRight, User } from "lucide-react";

export default function CourseGrid({
  courses = [],
  eyebrow = "Featured Catalog",
  title = "Explore All Courses",
  viewAllHref = null,
  className = "py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
}) {
  const hasHeader = Boolean(eyebrow || title || viewAllHref);

  return (
    <section className={className}>
      {hasHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {title}
              </h2>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-1.5 transition-all"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const thumbnail =
              course.thumbnail?.url ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
            const lessonCount = course.lessons?.length || 0;

            return (
              <div
                key={course.id || course.slug}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white uppercase tracking-wider">
                    {course.level || "Beginner"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                      <span>{course.category || "Development"}</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Layers className="w-3.5 h-3.5" /> {lessonCount} Lessons
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {course.description || "Master core concepts with hands-on practice."}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {course.instructor?.username || "SkillFlow Expert"}
                      </span>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-1.5 transition-all"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No courses found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search criteria or filter tags.
          </p>
        </div>
      )}
    </section>
  );
}
