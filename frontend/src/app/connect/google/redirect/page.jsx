"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function RedirectHandler() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token") || searchParams.get("id_token");
  const { handleGoogleCallback } = useAuth();
  const router = useRouter();
  const calledRef = useRef(false);

  useEffect(() => {
    // Handle Google OAuth callback and redirect based on the access token
    if (accessToken && !calledRef.current) {
      calledRef.current = true;
      handleGoogleCallback(accessToken).catch(() => {
        router.push("/login?error=google_failed");
      });
    } else if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, handleGoogleCallback, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 text-center px-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
      <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
        Completing Google authentication...
      </p>
    </div>
  );
}

export default function GoogleRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center min-h-[70vh] items-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      }
    >
      <RedirectHandler />
    </Suspense>
  );
}