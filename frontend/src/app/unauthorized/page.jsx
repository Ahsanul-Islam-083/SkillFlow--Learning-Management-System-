import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        403 — Access Forbidden
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md text-sm">
        Your current account role does not have the necessary permissions to access this dashboard.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedPage;