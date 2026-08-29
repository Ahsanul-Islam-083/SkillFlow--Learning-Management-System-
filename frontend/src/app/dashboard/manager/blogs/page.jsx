"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import StatusBadge from "@/components/common/StatusBadge";
import ImageUpload from "@/components/common/ImageUpload";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import {
  ArrowLeft,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  FileEdit,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Newspaper,
  Calendar,
  Sparkles,
  HelpCircle
} from "lucide-react";

export default function BlogManagementStudio() {
  const { user, token } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete modal state
  const [deleteModalBlog, setDeleteModalBlog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Tutorials",
    readTime: "5 min read",
    coverImageUrl: "",
    excerpt: "",
    content: "",
    isPublished: true,
  });

  // Load all blogs
  const loadBlogs = async () => {
    try {
      const res = await fetchAPI("/blogs?status=draft&populate=*&sort=createdAt:desc", { token });
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setBlogs(list);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [token]);

  // Open modal for new blog
  const handleOpenCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      category: "Tutorials",
      readTime: "5 min read",
      coverImageUrl: "",
      excerpt: "",
      content: "",
      isPublished: true,
    });
    setActiveTab("edit");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for editing existing blog
  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Tutorials",
      readTime: blog.readTime || "5 min read",
      coverImageUrl: blog.coverImageUrl || blog.coverImage?.url || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      isPublished: !!blog.publishedAt,
    });
    setActiveTab("edit");
    setFormError("");
    setIsModalOpen(true);
  };

  // Real-time title & slug auto-generation
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const autoSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      title,
      // only update slug if creating a new blog or if slug matches old auto-generated title
      slug: !editingBlog ? autoSlug : prev.slug,
    }));
  };

  // Submit create or edit form
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      setFormError("Title, excerpt, and article content are required.");
      return;
    }

    setSubmitting(true);

    try {
      const generatedSlug =
        formData.slug.trim() ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const blogPayload = {
        data: {
          title: formData.title.trim(),
          slug: generatedSlug,
          category: formData.category,
          readTime: formData.readTime.trim() || "5 min read",
          coverImageUrl: formData.coverImageUrl,
          excerpt: formData.excerpt.trim(),
          content: formData.content,
          author: user?.id,
          // Strapi draft & publish flag
          publishedAt: formData.isPublished ? new Date().toISOString() : null,
        },
      };

      const statusQuery = formData.isPublished ? "status=published" : "status=draft";

      if (editingBlog?.documentId || editingBlog?.id) {
        // Update existing blog
        const targetId = editingBlog.documentId || editingBlog.id;
        await fetchAPI(`/blogs/${targetId}?${statusQuery}`, {
          method: "PUT",
          token: token,
          body: blogPayload,
        });
      } else {
        // Create new blog
        await fetchAPI(`/blogs?${statusQuery}`, {
          method: "POST",
          token: token,
          body: blogPayload,
        });
      }


      await loadBlogs();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save blog error:", err);
      setFormError(err.message || "Failed to save article. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete blog confirmation
  const handleConfirmDelete = async () => {
    if (!deleteModalBlog) return;
    setDeleting(true);

    try {
      const targetId = deleteModalBlog.documentId || deleteModalBlog.id;
      await fetchAPI(`/blogs/${targetId}`, {
        method: "DELETE",
        token: token,
      });

      setBlogs((prev) => prev.filter((b) => (b.documentId || b.id) !== targetId));
      setDeleteModalBlog(null);
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert(err.message || "Failed to delete article.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All" || blog.category === categoryFilter;

    const isPub = !!blog.publishedAt;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && isPub) ||
      (statusFilter === "Draft" && !isPub);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/manager"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Editorial Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Blog Publishing Studio
              </h1>
            </div>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Write New Article
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or excerpt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Category and Status Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium transition"
              >
                <option value="All">All Categories</option>
                <option value="Tutorials">Tutorials</option>
                <option value="Web Development">Web Development</option>
                <option value="Career & Advice">Career & Advice</option>
                <option value="Tech News">Tech News</option>
                <option value="Student Success">Student Success</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium transition"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

          </div>
        </div>

        {/* Blogs Data Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-500" />
                All Articles ({filteredBlogs.length})
              </h2>
            </div>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="pb-3 pl-3 pr-4 min-w-[240px] whitespace-nowrap">Article & Excerpt</th>
                    <th className="pb-3 px-4 min-w-[130px] whitespace-nowrap">Category</th>
                    <th className="pb-3 px-4 min-w-[110px] whitespace-nowrap">Read Time</th>
                    <th className="pb-3 px-4 min-w-[120px] whitespace-nowrap">Author</th>
                    <th className="pb-3 px-4 min-w-[110px] whitespace-nowrap">Status</th>
                    <th className="pb-3 pl-4 pr-3 text-right min-w-[120px] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBlogs.map((blog) => {
                    const cover =
                      blog.coverImageUrl ||
                      blog.coverImage?.url ||
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop";
                    const isPub = !!blog.publishedAt;

                    return (
                      <tr
                        key={blog.documentId || blog.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group"
                      >
                        <td className="py-4 pl-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                              <Image src={cover} alt={blog.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition truncate">
                                {blog.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {blog.excerpt || "No excerpt provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                          {blog.category || "Tutorials"}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                          {blog.readTime || "5 min read"}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {blog.author?.username || user?.username || "Editorial Team"}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <StatusBadge status={isPub ? "Published" : "Draft"} />
                        </td>

                        <td className="py-4 pl-4 pr-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Public Article */}
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              title="View Public Article"
                              className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Edit Article */}
                            <button
                              onClick={() => handleOpenEditModal(blog)}
                              title="Edit Article"
                              className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete Article */}
                            <button
                              onClick={() => setDeleteModalBlog(blog)}
                              title="Delete Article"
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No articles match criteria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try clearing filters or search terms.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE & EDIT MODAL DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {editingBlog ? "Article Editor" : "New Publication"}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {editingBlog ? "Edit Article" : "Write New Blog Post"}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Alert */}
            {formError && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleSaveBlog} className="p-6 overflow-y-auto space-y-6 flex-1">

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architecting High-Performance Applications with Next.js 15"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                {/* Slug & Category & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="architecting-high-performance-nextjs-15"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 font-mono transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      <option value="Tutorials">Tutorials</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Career & Advice">Career & Advice</option>
                      <option value="Tech News">Tech News</option>
                      <option value="Student Success">Student Success</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Reading Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 min read"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="mt-1.5 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <ImageUpload
                  value={formData.coverImageUrl}
                  onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                  label="Article Cover Photo (ImgBB)"
                />

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Summary / Excerpt *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short engaging teaser shown on article cards and search snippets..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="mt-1.5 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                {/* Content Editor with Tab Navigation (Raw Markdown vs Live Formatted Preview) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileEdit className="w-3.5 h-3.5 text-purple-500" />
                      Article Body (Markdown Supported) *
                    </label>

                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setActiveTab("edit")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === "edit"
                          ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          }`}
                      >
                        Edit Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeTab === "preview"
                          ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          }`}
                      >
                        <Eye className="w-3 h-3" /> Live Preview
                      </button>
                    </div>
                  </div>

                  {activeTab === "edit" ? (
                    <textarea
                      rows={10}
                      required
                      placeholder="Write your article in Markdown. Supports # Headings, **bold**, *italics*, `code`, ```codeblocks```, lists, and blockquotes..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-purple-500 transition leading-relaxed"
                    />
                  ) : (
                    <div className="min-h-[220px] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto">
                      {formData.content ? (
                        <MarkdownRenderer content={formData.content} />
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Markdown preview will appear here once you write article content.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Published vs Draft Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100/60 transition">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Publish Immediately
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formData.isPublished
                          ? "This article will be visible immediately on the public blog feed."
                          : "Saved as an editorial draft. Hidden from public readers until published."}
                      </p>
                    </div>
                  </label>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {submitting
                      ? "Saving Article..."
                      : editingBlog
                        ? "Update Article"
                        : formData.isPublished
                          ? "Publish Article"
                          : "Save Draft"}
                  </span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Article?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently delete &quot;{deleteModalBlog.title}&quot;? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalBlog(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{deleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
