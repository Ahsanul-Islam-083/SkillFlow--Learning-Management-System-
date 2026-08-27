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
    const [coursesRes, blogsRes, enrollmentsRes] = await Promise.all([
      fetchAPI("/courses?populate=*"),
      fetchAPI("/blogs?populate=*"), 
      fetchAPI("/enrollments?populate[0]=course"),
    ]);

    const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : Array.isArray(coursesRes) ? coursesRes : [];
    const blogs = Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [];
    const enrollments = Array.isArray(enrollmentsRes?.data) ? enrollmentsRes.data : Array.isArray(enrollmentsRes) ? enrollmentsRes : [];

    // Count enrollments per course by documentId / id
    const enrollmentCountMap = {};
    enrollments.forEach((e) => {
      const courseId = e.course?.documentId || e.course?.id;
      if (courseId) {
        enrollmentCountMap[courseId] = (enrollmentCountMap[courseId] || 0) + 1;
      }
    });

    // Sort all courses descending by enrollment count and take the first 3
    const featuredCourses = [...courses]
      .sort((a, b) => {
        const aId = a.documentId || a.id;
        const bId = b.documentId || b.id;
        const countA = enrollmentCountMap[aId] || 0;
        const countB = enrollmentCountMap[bId] || 0;
        return countB - countA;
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