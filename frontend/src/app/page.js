"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import CourseGrid from "@/components/courses/CourseGrid";
import FeatureGrid from "@/components/home/FeatureGrid";
import LatestBlogs from "@/components/home/LatestBlogs";
import RoleCta from "@/components/home/RoleCta";
import SkillFlowSystemLoader from "@/components/common/SkillFlowSystemLoader";
import { fetchAPI } from "@/lib/api";

export default function HomePage() {
  const [booting, setBooting] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          fetchAPI("/courses?populate=*"),
          fetchAPI("/blogs?populate=*"),
        ]);

        const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : Array.isArray(coursesRes) ? coursesRes : [];
        const blogsData = Array.isArray(blogsRes?.data) ? blogsRes.data : Array.isArray(blogsRes) ? blogsRes : [];

        // Sort by createdAt descending (newest first) with safe fallback, then take top 3
        const topCourses = [...courses]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);

        setFeaturedCourses(topCourses);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Home page data fetch error:", error);
      }
    }

    loadHomeData();
  }, []);

  if (booting) {
    return <SkillFlowSystemLoader onComplete={() => setBooting(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen transition-opacity duration-500">
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