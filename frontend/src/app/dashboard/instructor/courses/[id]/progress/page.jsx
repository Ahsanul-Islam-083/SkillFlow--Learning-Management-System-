"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import {
    ArrowLeft,
    Users,
    Loader2
} from "lucide-react";

const CourseProgressPage = () => {

    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourse() {
            if (!id) return;
            try {
                const isNumeric = /^\d+$/.test(id);
                const filterQuery = isNumeric
                    ? `/courses?filters[$or][0][id][$eq]=${id}&filters[$or][1][documentId][$eq]=${id}&filters[$or][2][slug][$eq]=${id}&populate=*`
                    : `/courses?filters[$or][0][documentId][$eq]=${id}&filters[$or][1][slug][$eq]=${id}&populate=*`;

                let data = null;
                try {
                    const res = await fetchAPI(filterQuery);
                    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                    if (list.length > 0) {
                        data = list[0];
                    }
                } catch (filterErr) {
                    console.warn("Filtered course query failed, attempting direct fetch:", filterErr);
                }

                if (!data) {
                    const singleRes = await fetchAPI(`/courses/${id}?populate=*`);
                    data = singleRes?.data || singleRes;
                }

                if (data) {
                    setCourse(data);
                }
            } catch (err) {
                console.error("Failed to load progress:", err);
            } finally {
                setLoading(false);
            }
        }
        loadCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/instructor"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                            Student Performance Analytics
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {course?.title || "Course"}
                        </h1>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-teal-500" />
                            Enrolled Learners Progress
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">Real-time sync</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="pb-3">Learner</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Progress</th>
                                    <th className="pb-3 text-right">Completion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="py-4 font-bold text-slate-900 dark:text-white">Alex Johnson</td>
                                    <td className="py-4 text-emerald-600 dark:text-emerald-400 font-medium">In Progress</td>
                                    <td className="py-4">
                                        <div className="w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-teal-500 rounded-full w-[60%]" />
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-bold text-slate-900 dark:text-white">60%</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="py-4 font-bold text-slate-900 dark:text-white">Sarah Williams</td>
                                    <td className="py-4 text-emerald-600 dark:text-emerald-400 font-medium">Completed</td>
                                    <td className="py-4">
                                        <div className="w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-teal-500 rounded-full w-[100%]" />
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-bold text-slate-900 dark:text-white">100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CourseProgressPage;