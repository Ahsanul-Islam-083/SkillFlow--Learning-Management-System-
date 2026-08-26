"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PlayCircle, ArrowRight } from "lucide-react";

const EnrollButton = ({ courseSlug }) => {
const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAction = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseSlug}`);
    } else {
      router.push(`/courses/${courseSlug}/learn`);
    }
  };

  return (
    <button
      onClick={handleAction}
      className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
    >
      <PlayCircle className="w-5 h-5" />
      <span>{isAuthenticated ? "Start Learning Now" : "Enroll for Free"}</span>
      <ArrowRight className="w-4 h-4 ml-1" />
    </button>
  );
};

export default EnrollButton;