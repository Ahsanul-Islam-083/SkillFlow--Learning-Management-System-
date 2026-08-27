"use client";

import { useState } from "react";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseGrid from "@/components/courses/CourseGrid";

export default function CourseCatalogClient({ allCourses = [] }) {
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Course Catalog
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Explore All Courses
          </h1>
        </div>
      </div>

      <CourseFilters courses={allCourses} onFilterChange={setFilteredCourses} />

      <CourseGrid
        courses={filteredCourses}
        eyebrow=""
        title=""
        className=""
      />
    </div>
  );
}
