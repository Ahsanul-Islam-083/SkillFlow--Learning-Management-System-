import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Clock, ArrowLeft, Calendar, User } from "lucide-react";

export const revalidate = 60;

async function getBlog(slug) {
  try {
    const res = await fetchAPI(`/blogs?filters[slug][$eq]=${slug}&populate=*`);
    const blogs = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return blogs[0] || null;
  } catch (error) {
    console.error("Single blog fetch error:", error);
    return null;
  }
}

const SingleBlogPage = async ({ params }) => {
const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const cover =
    blog.coverImage?.url ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";

  return (
    <article className="min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          {blog.title}
        </h1>

      
        <div className="flex flex-wrap items-center gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{blog.author?.username || "SkillFlow Editorial"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{blog.readTime || "5 min read"}</span>
          </div>
          {blog.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

      
        <div className="relative aspect-video my-8 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <Image src={cover} alt={blog.title} fill className="object-cover" priority />
        </div>

       
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base space-y-4">
          {blog.content ? (
            <div className="whitespace-pre-line">{blog.content}</div>
          ) : (
            <p>{blog.excerpt || "No content available for this publication."}</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default SingleBlogPage;