"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * MarkdownRenderer
 * Renders a Markdown string using `react-markdown` + `remark-gfm`.
 *
 * Supports all CommonMark features plus GitHub Flavored Markdown extensions
 * (tables, strikethrough, task lists, autolinks) via remark-gfm.
 *
 * @param {string} content   - Raw Markdown source string to render.
 * @param {string} className - Optional extra CSS classes on the wrapper div.
 */
export default function MarkdownRenderer({ content = "", className = "" }) {
  // Guard: render nothing when content is absent or not a string
  if (!content || typeof content !== "string") {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          //  Headings 
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-8 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">
              {children}
            </h4>
          ),

          //  Body text ─
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed my-2.5">
              {children}
            </p>
          ),

          //  Inline formatting ─
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-800 dark:text-slate-200">
              {children}
            </em>
          ),

          //  Link 
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-500 transition"
            >
              {children}
            </a>
          ),

          //  Blockquote 
          blockquote: ({ children }) => (
            <blockquote className="p-4 my-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-500 text-slate-700 dark:text-slate-300 italic text-sm">
              {children}
            </blockquote>
          ),

          //  Lists ─
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-3 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),

          //  Horizontal rule ─
          hr: () => (
            <hr className="my-6 border-slate-200 dark:border-slate-800" />
          ),

          //  GFM table (bonus — not in old parser) ─
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{children}</td>
          ),

          //  Code — inline & fenced 
          code: ({ inline, className: codeClassName, children }) => {
            // Inline code snippet (e.g. `variable`)
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs border border-slate-200/60 dark:border-slate-700/60">
                  {children}
                </code>
              );
            }

            // Fenced code block — extract language from className (e.g. "language-javascript")
            const languageMatch = /language-(\w+)/.exec(codeClassName || "");
            const language = languageMatch ? languageMatch[1] : null;

            return (
              <div className="my-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono shadow-sm">
                {language && (
                  <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
