"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function RedirectHandler() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token") || searchParams.get("id_token");
  const { handleGoogleCallback } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      handleGoogleCallback(accessToken).catch(() => {
        router.push("/login?error=google_failed");
      });
    } else {
      router.push("/login");
    }
  }, [accessToken, handleGoogleCallback, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      <p className="text-gray-600 font-medium">Completing Google authentication...</p>
    </div>
  );
}

export default function GoogleRedirectPage() {
  return (
    <Suspense fallback={<div className="flex justify-center min-h-[70vh] items-center">Loading...</div>}>
      <RedirectHandler />
    </Suspense>
  );
}