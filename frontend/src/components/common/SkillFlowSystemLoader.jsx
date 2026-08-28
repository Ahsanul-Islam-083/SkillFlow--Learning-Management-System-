"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Terminal, ShieldCheck, Sparkles, Cpu } from "lucide-react";

/**
 * SkillFlowSystemLoader - Developer Terminal Loading Screen
 * Displays a glowing bootloader with dynamic percentage counting,
 * progress bar, and real-time sub-logs during initial landing page boot.
 */
export default function SkillFlowSystemLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const totalDurationMs = 2000; // ~2 seconds total boot time
    const intervalMs = 20;
    const increment = 100 / (totalDurationMs / intervalMs);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, Math.round((prev + increment) * 10) / 10);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, []);

  // Determine dynamic log message based on current progress
  const getSubLog = (pct) => {
    if (pct < 26) return "Initializing Core Matrix Engine...";
    if (pct < 56) return "Loading Next.js 15 & Strapi v5 Kernel...";
    if (pct < 81) return "Calibrating Curriculum Sandbox Shards...";
    if (pct < 100) return "Establishing Secure Role Policies...";
    return "Kernel Active. Welcome, Developer.";
  };

  const integerProgress = Math.floor(progress);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950 px-4 font-mono select-none overflow-hidden">
      
      {/* 🔮 Background Ambient Blur Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[560px] h-[320px] bg-gradient-to-tr from-indigo-600/40 via-cyan-500/30 to-blue-500/40 blur-3xl rounded-full animate-pulse pointer-events-none -z-10" />

      <div className="w-full max-w-md flex flex-col items-center space-y-8 relative">
        
        {/* 🌟 Logo & Brand Glow */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl md:rounded-3xl bg-slate-900/90 border border-slate-800 p-2.5 flex items-center justify-center shadow-2xl backdrop-blur-xl">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/favicon.png"
                alt="SkillFlow Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* 💻 Terminal Card Window */}
        <div className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          
          {/* Terminal Card Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                SYSTEM BOOTSTRAP v2.5.0
              </span>
            </div>
            
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
              PROD
            </span>
          </div>

          {/* Progress Metrics & Status Header */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              {integerProgress === 100 ? "Systems Calibrated" : "Initiating Systems..."}
            </span>
            <span className="text-cyan-400 font-mono tracking-tight text-sm">
              {integerProgress}%
            </span>
          </div>

          {/* Glowing Gradient Neon Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/80 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-teal-400 transition-all duration-75 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Sub-Log with Blinking Terminal Cursor */}
          <div className="min-h-[2.25rem] flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400 leading-snug flex-1 truncate">
              <span className="text-slate-600 mr-2">&gt;</span>
              <span className={integerProgress === 100 ? "text-emerald-400 font-semibold" : "text-slate-300"}>
                {getSubLog(integerProgress)}
              </span>
              <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1.5 animate-pulse align-middle" />
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
            <span>Kernel: SkillFlow Matrix v2.5</span>
            <span className="text-cyan-500 font-mono">TLS 1.3 • AES-256</span>
          </div>
        </div>

      </div>
    </div>
  );
}
