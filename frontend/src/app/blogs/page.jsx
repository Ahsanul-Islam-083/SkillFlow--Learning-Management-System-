import Link from "next/link";
import Image from "next/image";
import { fetchAPI } from "@/lib/api";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 60;

async function getBlogs() {
    try {
        const res = await fetchAPI("/blogs?populate=*");
        return Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    } catch (error) {
        console.error("Blogs list fetch error:", error);
        return [];
    }
}

const BlogsPage = async () => {
    const blogs = await getBlogs();

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        SkillFlow Publication
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
                        Articles, Guides & Tech Insights
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Stay ahead with high-impact engineering tutorials, industry trends, and deep dives.
                    </p>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => {
                            const cover =
                                blog.coverImage?.url ||
                                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";

                            return (
                                <Link
                                    key={blog.id || blog.slug}
                                    href={`/blogs/${blog.slug}`}
                                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition duration-300"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <Image
                                            src={cover}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                <span>{blog.readTime || "5 min read"}</span>
                                            </div>
                                            <h2 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                {blog.title}
                                            </h2>
                                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                                                {blog.excerpt || "Click to read the complete technical guide on SkillFlow."}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                            Read Full Story <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Articles Published Yet</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Check back soon as our authors curate technical insights.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;