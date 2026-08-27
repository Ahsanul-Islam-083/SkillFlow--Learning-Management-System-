import HeroSection from "@/components/home/HeroSection";
import CourseGrid from "@/components/courses/CourseGrid";
import FeatureGrid from "@/components/home/FeatureGrid";
import LatestBlogs from "@/components/home/LatestBlogs";
import RoleCta from "@/components/home/RoleCta";
import { fetchAPI } from "@/lib/api";

// dynamic data fetching (SSR / ISR)
export const revalidate = 60; 

async function getHomeData() {
  try {
    const [coursesRes, blogsRes] = await Promise.all([
      fetchAPI("/courses?populate=*"),
      fetchAPI("/blogs?populate=*"),
    ]);

    const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : Array.isArray(coursesRes) ? coursesRes : [];
    const blogs = Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [];

    // Sort by createdAt descending (newest first) with safe fallback, then take top 3
    const featuredCourses = [...courses]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);

    return {
      featuredCourses,
      blogs,
    };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return { featuredCourses: [], blogs: [] };
  }
}

export default async function HomePage() {
  const { featuredCourses, blogs } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CourseGrid
        courses={featuredCourses}
        eyebrow="Popular Curriculum"
        title="Featured Courses"
        viewAllHref="/courses"
      />
      <FeatureGrid />
      <LatestBlogs blogs={blogs} />
      <RoleCta />
    </div>
  );
}