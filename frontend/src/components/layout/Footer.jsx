"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
    const pathname = usePathname();

    // Do not render global Footer inside the dashboard workspace
    if (pathname && pathname.startsWith("/dashboard")) {
        return null;
    }

    return (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 dark:bg-slate-950 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5 text-white font-bold text-xl">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src="/logosf.png"
                                    alt="SkillFlow Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            SkillFlow LMS
                        </div>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Adaptive role-driven education ecosystem powered by Next.js App Router and Headless Strapi CMS.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 w-fit px-3 py-1 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" /> 4-Role Enterprise RBAC Active
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/courses" className="hover:text-white transition">Course Catalog</Link></li>
                            <li><Link href="/about" className="hover:text-white transition">About SkillFlow</Link></li>
                            <li><Link href="/blogs" className="hover:text-white transition">Tech Blog & Updates</Link></li>
                            <li><Link href="/login" className="hover:text-white transition">Portal Access</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Workspaces</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>Student Learning & Quizzes</li>
                            <li>Instructor Course Studio</li>
                            <li>Content Editor Hub</li>
                            <li>Admin Governance Suite</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                    <p>© 2026 SkillFlow LMS. All rights reserved.</p>
                    <p>Decoupled Next.js 16 & Strapi Architecture</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;