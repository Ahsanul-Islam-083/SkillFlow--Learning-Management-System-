"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Terminal, FileCode, Cpu, Copy, Check, Sparkles } from "lucide-react";

/**
 * SkillFlowHeroMatrix - Developer-Centric Interactive Code Matrix
 * Features multi-tab IDE switching, typewriter line animation, tokenized syntax highlighting,
 * dynamic blinking cursor, glassmorphism ambient glow, and copy-to-clipboard actions.
 */

const TABS = [
  {
    id: "config",
    name: "skillflow.config.ts",
    icon: FileCode,
    lang: "typescript",
    badge: "Config Matrix",
    lines: [
      [
        { text: "import", type: "keyword" },
        { text: " { ", type: "punct" },
        { text: "defineConfig", type: "method" },
        { text: ", ", type: "punct" },
        { text: "SkillFlowEngine", type: "type" },
        { text: " } ", type: "punct" },
        { text: "from", type: "keyword" },
        { text: ' "@skillflow/core"', type: "string" },
        { text: ";", type: "punct" },
      ],
      [],
      [
        { text: "export default", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "defineConfig", type: "method" },
        { text: "({", type: "punct" },
      ],
      [
        { text: "  workspace", type: "prop" },
        { text: ": ", type: "punct" },
        { text: '"SkillFlow Production"', type: "string" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "  runtime", type: "prop" },
        { text: ": ", type: "punct" },
        { text: '"Next.js 16 + Turbopack"', type: "string" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "  engine", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "new", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "SkillFlowEngine", type: "type" },
        { text: "({", type: "punct" },
      ],
      [
        { text: "    curriculum", type: "prop" },
        { text: ": ", type: "punct" },
        { text: '"Full-Stack Architecture"', type: "string" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "    autoGrading", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "true", type: "type" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "    liveTelemetry", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "true", type: "type" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "  }),", type: "punct" },
      ],
      [
        { text: "  rbac", type: "prop" },
        { text: ": [", type: "punct" },
        { text: '"Student"', type: "string" },
        { text: ", ", type: "punct" },
        { text: '"Instructor"', type: "string" },
        { text: ", ", type: "punct" },
        { text: '"Manager"', type: "string" },
        { text: ", ", type: "punct" },
        { text: '"Admin"', type: "string" },
        { text: "],", type: "punct" },
      ],
      [
        { text: "});", type: "punct" },
      ],
    ],
    plainCode: `import { defineConfig, SkillFlowEngine } from "@skillflow/core";

export default defineConfig({
  workspace: "SkillFlow Production",
  runtime: "Next.js 16 + Turbopack",
  engine: new SkillFlowEngine({
    curriculum: "Full-Stack Architecture",
    autoGrading: true,
    liveTelemetry: true,
  }),
  rbac: ["Student", "Instructor", "Manager", "Admin"],
});`,
  },
  {
    id: "engine",
    name: "CurriculumEngine.ts",
    icon: Cpu,
    lang: "typescript",
    badge: "Evaluation Kernel",
    lines: [
      [
        { text: "import", type: "keyword" },
        { text: " { ", type: "punct" },
        { text: "AssessmentRunner", type: "type" },
        { text: ", ", type: "punct" },
        { text: "SyllabusSync", type: "type" },
        { text: " } ", type: "punct" },
        { text: "from", type: "keyword" },
        { text: ' "@/lib/engine"', type: "string" },
        { text: ";", type: "punct" },
      ],
      [],
      [
        { text: "export async function", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "evaluateCohort", type: "method" },
        { text: "(", type: "punct" },
        { text: "trackId", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "string", type: "type" },
        { text: ") {", type: "punct" },
      ],
      [
        { text: "  const", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "track", type: "plain" },
        { text: " = ", type: "punct" },
        { text: "await", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "SyllabusSync", type: "type" },
        { text: ".", type: "punct" },
        { text: "loadCurriculum", type: "method" },
        { text: "(", type: "punct" },
        { text: "trackId", type: "prop" },
        { text: ");", type: "punct" },
      ],
      [
        { text: "  const", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "verdict", type: "plain" },
        { text: " = ", type: "punct" },
        { text: "await", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "AssessmentRunner", type: "type" },
        { text: ".", type: "punct" },
        { text: "gradeExam", type: "method" },
        { text: "({", type: "punct" },
      ],
      [
        { text: "    threshold", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "0.80", type: "type" },
        { text: ",", type: "punct" },
        { text: "    antiTamper", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "true", type: "type" },
        { text: ",", type: "punct" },
      ],
      [
        { text: "  });", type: "punct" },
      ],
      [],
      [
        { text: "  return", type: "keyword" },
        { text: " { ", type: "punct" },
        { text: "status", type: "prop" },
        { text: ': "', type: "punct" },
        { text: "SUCCESS", type: "string" },
        { text: '", ', type: "punct" },
        { text: "progress", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "100", type: "type" },
        { text: ", ", type: "punct" },
        { text: "verified", type: "prop" },
        { text: ": ", type: "punct" },
        { text: "true", type: "type" },
        { text: " };", type: "punct" },
      ],
      [
        { text: "}", type: "punct" },
      ],
    ],
    plainCode: `import { AssessmentRunner, SyllabusSync } from "@/lib/engine";

export async function evaluateCohort(trackId: string) {
  const track = await SyllabusSync.loadCurriculum(trackId);
  const verdict = await AssessmentRunner.gradeExam({
    threshold: 0.80,
    antiTamper: true,
  });

  return { status: "SUCCESS", progress: 100, verified: true };
}`,
  },
  {
    id: "terminal",
    name: "terminal.sh",
    icon: Terminal,
    lang: "bash",
    badge: "CLI Pipeline",
    lines: [
      [
        { text: "$ skillflow deploy --target=cloud --matrix=prod", type: "cmd" },
      ],
      [
        { text: "[KERNEL] Initializing SkillFlow v2.5 Architecture...", type: "info" },
      ],
      [
        { text: "[RBAC] Verifying permissions (Student | Instructor | Admin)...", type: "plain" },
        { text: " [OK]", type: "type" },
      ],
      [
        { text: "[CURRICULUM] Hydrating 50+ tracks & video player engines...", type: "plain" },
      ],
      [
        { text: "[ASSESSMENT] MCQ auto-grading & telemetry ready...", type: "plain" },
        { text: " [OK]", type: "type" },
      ],
      [
        { text: "[TURBOPACK] Client/SSR bundle compiled in 1.48s", type: "info" },
      ],
      [],
      [
        { text: "✔ SkillFlow Matrix active at https://skillflow.app", type: "type" },
      ],
      [
        { text: "✔ Health check passed (100% test coverage)", type: "type" },
      ],
    ],
    plainCode: `$ skillflow deploy --target=cloud --matrix=prod
[KERNEL] Initializing SkillFlow v2.5 Architecture...
[RBAC] Verifying permissions (Student | Instructor | Admin)... [OK]
[CURRICULUM] Hydrating 50+ tracks & video player engines...
[ASSESSMENT] MCQ auto-grading & telemetry ready... [OK]
[TURBOPACK] Client/SSR bundle compiled in 1.48s

✔ SkillFlow Matrix active at https://skillflow.app
✔ Health check passed (100% test coverage)`,
  },
];

export default function SkillFlowHeroMatrix() {
  const [activeTabId, setActiveTabId] = useState("config");
  // Default to all lines visible so SSR and initial render display full code immediately
  const [visibleLineCount, setVisibleLineCount] = useState(TABS[0].lines.length);
  const [copied, setCopied] = useState(false);

  const activeTab = useMemo(
    () => TABS.find((t) => t.id === activeTabId) || TABS[0],
    [activeTabId]
  );

  // Switch tab with smooth typewriter reveal
  const handleTabSwitch = useCallback((tabId) => {
    if (tabId === activeTabId) return;
    setActiveTabId(tabId);
    const targetTab = TABS.find((t) => t.id === tabId) || TABS[0];
    const totalLines = targetTab.lines.length;
    
    // Quick line-by-line reveal
    setVisibleLineCount(1);
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      setVisibleLineCount(current);
      if (current >= totalLines) {
        clearInterval(interval);
      }
    }, 60);
  }, [activeTabId]);

  // Copy code handler with visual feedback & fallback
  const handleCopy = useCallback(async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeTab.plainCode);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = activeTab.plainCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [activeTab.plainCode]);

  // Token color styling matching SkillFlow Cyan-to-Indigo palette
  const renderToken = (token, idx) => {
    switch (token.type) {
      case "keyword":
        return (
          <span key={idx} className="text-purple-400 font-semibold">
            {token.text}
          </span>
        );
      case "method":
        return (
          <span key={idx} className="text-cyan-300 font-medium">
            {token.text}
          </span>
        );
      case "prop":
        return (
          <span key={idx} className="text-sky-300">
            {token.text}
          </span>
        );
      case "string":
        return (
          <span key={idx} className="text-amber-300">
            {token.text}
          </span>
        );
      case "type":
        return (
          <span key={idx} className="text-emerald-400 font-medium">
            {token.text}
          </span>
        );
      case "cmd":
        return (
          <span key={idx} className="text-cyan-300 font-bold">
            {token.text}
          </span>
        );
      case "info":
        return (
          <span key={idx} className="text-indigo-300">
            {token.text}
          </span>
        );
      case "punct":
        return (
          <span key={idx} className="text-slate-400">
            {token.text}
          </span>
        );
      default:
        return (
          <span key={idx} className="text-slate-200">
            {token.text}
          </span>
        );
    }
  };

  return (
    <div className="relative group w-full max-w-xl lg:max-w-none mx-auto select-text">
      {/* 🌟 Ambient Glow & Glassmorphism Backlight */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 via-cyan-500/25 to-indigo-600/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* 💻 Studio Code Shell */}
      <div className="relative rounded-2xl md:rounded-3xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono transition-all duration-300">
        
        {/* Top Window Bar: Traffic Lights, Multi-tab Switcher, and Copy Button */}
        <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-3 select-none">
          
          {/* Traffic Lights & IDE Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-x-auto no-scrollbar">
            {/* macOS Window Dots */}
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 shadow-xs" />
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabSwitch(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-slate-800/90 text-cyan-300 shadow-xs border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className="truncate">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Code Action Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition shadow-xs cursor-pointer"
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 📜 Code Body Workspace */}
        <div className="p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed min-h-[300px] max-h-[360px] overflow-y-auto overflow-x-auto font-mono text-slate-300">
          <div className="space-y-1">
            {activeTab.lines.map((tokens, lineIdx) => {
              const isVisible = lineIdx < visibleLineCount;
              const isTypingActive = lineIdx === visibleLineCount - 1 && visibleLineCount < activeTab.lines.length;

              if (!isVisible) return null;

              const lineNum = String(lineIdx + 1).padStart(2, "0");

              return (
                <div
                  key={lineIdx}
                  className={`flex items-start gap-4 transition-colors duration-150 rounded px-1.5 py-0.5 ${
                    isTypingActive ? "bg-cyan-500/10 border-l-2 border-cyan-400 pl-1" : "hover:bg-slate-900/50"
                  }`}
                >
                  {/* Line Number */}
                  <span className="text-slate-600 select-none text-right w-5 flex-shrink-0 font-mono text-xs pt-0.5">
                    {lineNum}
                  </span>

                  {/* Tokenized Content */}
                  <div className="flex-1 whitespace-pre font-mono">
                    {tokens.length === 0 ? (
                      <span>&nbsp;</span>
                    ) : (
                      tokens.map((token, tIdx) => renderToken(token, tIdx))
                    )}

                    {/* Dynamic Pulsing Cursor on active typing line */}
                    {isTypingActive && (
                      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* End of block cursor when all lines finish */}
            {visibleLineCount >= activeTab.lines.length && (
              <div className="flex items-center gap-4 px-1.5 py-0.5">
                <span className="text-slate-600 select-none text-right w-5 flex-shrink-0 font-mono text-xs">
                  {String(activeTab.lines.length + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ⚡ Terminal Status Footer */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-300">SkillFlow Kernel</span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Production Matrix</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-cyan-400 font-mono">UTF-8</span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-slate-300">{activeTab.badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
