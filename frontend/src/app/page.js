import HeroSection from "@/components/home/HeroSection";
import CourseCatalog from "@/components/home/CourseCatalog";
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

    return {
      courses: Array.isArray(coursesRes?.data) ? coursesRes.data : Array.isArray(coursesRes) ? coursesRes : [],
      blogs: Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [],
    };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return { courses: [], blogs: [] };
  }
}

export default async function HomePage() {
  const { courses, blogs } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CourseCatalog initialCourses={courses} />
      <FeatureGrid />
      <LatestBlogs blogs={blogs} />
      <RoleCta />
    </div>
  );
}