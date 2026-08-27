"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Loader2, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email, pass) => {
    setIdentifier(email);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign in to SkillFlow
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Access your courses, quizzes, and role dashboards
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-800/50 dark:text-rose-300 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* গুগল লগইন */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {/* কুইক টেস্ট ক্রেডেনশিয়াল বাটনসমূহ */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Demo Accounts (Click to Fill):
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@example.com", "Admin@12345")}
              className="text-left px-2 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              👑 <strong>Admin</strong>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("manager@example.com", "Manager@12345")}
              className="text-left px-2 py-1 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 transition"
            >
              📝 <strong>Manager</strong>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("instructor@example.com", "Admin@12345")}
              className="text-left px-2 py-1 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition"
            >
              👨‍🏫 <strong>Instructor</strong>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("student@example.com", "Student@12345")}
              className="text-left px-2 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
            >
              🎓 <strong>Student</strong>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register as Student
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;