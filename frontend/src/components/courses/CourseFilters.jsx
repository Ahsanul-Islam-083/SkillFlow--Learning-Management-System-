"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

export default function CourseFilters({ courses = [], onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // catalog list making
  const categories = useMemo(() => {
    const list = new Set(["All"]);
    courses.forEach((c) => {
      if (c.category) list.add(c.category);
    });
    return Array.from(list);
  }, [courses]);

  // live search and filter logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" || course.level?.toLowerCase() === selectedLevel.toLowerCase();

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredCourses);
    }
  }, [filteredCourses, onFilterChange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs outline-none focus:ring-2 focus:ring-indigo-600 transition"
        >
          <option value="All">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
