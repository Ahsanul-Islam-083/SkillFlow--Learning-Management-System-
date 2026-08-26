import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import EnrollButton from "@/components/courses/EnrollButton";
import CourseSyllabus from "@/components/courses/CourseSyllabus";
import { BookOpen, Layers, User, Award, CheckCircle2, ShieldCheck, Clock } from "lucide-react";



export const revalidate = 60;

async function getCourse(slug) {
    try {
        const res = await fetchAPI(`/courses?filters[slug][$eq]=${slug}&populate=*`);
        const courses = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        return courses[0] || null;
    } catch (error) {
        console.error("Course detail fetch error:", error);
        return null;
    }
}

const CourseDetailPage = async ({ params }) => {

    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    const thumbnail =
        course.thumbnail?.url ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
    const lessons = course.lessons || [];
    const quizzes = course.quizzes || [];

    return (
        <div className="min-h-screen py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                    {course.category || "Programming"}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                                    {course.level || "Beginner"}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {course.title}
                            </h1>
                            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                       
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Created by Lead Instructor</p>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {course.instructor?.username || "SkillFlow Verified Lead"}
                                </h4>
                            </div>
                        </div>

                      
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Course Syllabus & Outline
                            </h3>
                            <CourseSyllabus lessons={lessons} quizzes={quizzes} />
                        </div>
                    </div>

                  
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 shadow-sm space-y-6">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <Image src={thumbnail} alt={course.title} fill className="object-cover" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Lectures</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{lessons.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Quizzes</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{quizzes.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Access</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">Lifetime Free</span>
                                </div>
                            </div>

                            <EnrollButton courseSlug={course.slug} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;