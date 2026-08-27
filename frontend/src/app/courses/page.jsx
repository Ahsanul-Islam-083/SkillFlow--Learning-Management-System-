import CourseCatalogClient from "@/components/courses/CourseCatalogClient";
import { fetchAPI } from "@/lib/api";

export const metadata = {
  title: "All Courses — SkillFlow LMS",
  description: "Browse all available courses, tracks, and learning paths on SkillFlow LMS.",
};

export const revalidate = 60;

async function getAllCourses() {
  try {
    const res = await fetchAPI("/courses?populate=*");
    return Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("Courses page fetch error:", error);
    return [];
  }
}

export default async function CoursesPage() {
  const allCourses = await getAllCourses();

  return (
    <main className="min-h-screen">
      <CourseCatalogClient allCourses={allCourses} />
    </main>
  );
}
