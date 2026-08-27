import React from "react";

/**
 * Robust Zero-Dependency Markdown Renderer
 * Parses and displays structured Markdown formatting for articles and notes.
 * @param {string} content - Raw Markdown string
 * @param {string} className - Optional container styling
 */
export default function MarkdownRenderer({ content = "", className = "" }) {
  if (!content || typeof content !== "string") {
    return null;
  }

  // Helper to parse inline styles (bold, italic, inline code, links)
  const parseInline = (text) => {
    if (!text) return text;

    // Tokenize line to handle nested formatting safely
    const tokens = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // 1. Inline Code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs border border-slate-200/60 dark:border-slate-700/60"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // 2. Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        tokens.push(
          <strong key={keyIdx++} className="font-bold text-slate-900 dark:text-white">
            {parseInline(boldMatch[2])}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // 3. Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        tokens.push(
          <em key={keyIdx++} className="italic text-slate-800 dark:text-slate-200">
            {parseInline(italicMatch[2])}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // 4. Links: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push(
          <a
            key={keyIdx++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-500 transition"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Plain text up to next special character
      const nextSpecial = remaining.search(/[`*_\[]/);
      if (nextSpecial === -1) {
        tokens.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        // Unmatched special char, take 1 character as text
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        tokens.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return tokens;
  };

  // Split into lines for block-level parsing
  const lines = content.split(/\r?\n/);
  const elements = [];
  let inCodeBlock = false;
  let codeBlockLanguage = "";
  let codeBlockLines = [];
  let currentList = [];
  let isOrderedList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isOrderedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1.5 my-3 text-slate-700 dark:text-slate-300">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1.5 my-3 text-slate-700 dark:text-slate-300">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code Block Fence (```)
    if (line.trim().startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono shadow-sm"
          >
            {codeBlockLanguage && (
              <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>{codeBlockLanguage}</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{codeBlockLines.join("\n")}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLanguage = "";
      } else {
        // Start of code block
        inCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3).trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Unordered List Items (- or * )
    const ulMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (ulMatch) {
      if (isOrderedList && currentList.length > 0) flushList();
      isOrderedList = false;
      currentList.push(ulMatch[1]);
      continue;
    }

    // 3. Ordered List Items (1. , 2. )
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!isOrderedList && currentList.length > 0) flushList();
      isOrderedList = true;
      currentList.push(olMatch[1]);
      continue;
    }

    // If not a list item, flush any accumulated list
    flushList();

    // 4. Headings (#, ##, ###, ####)
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-8 mb-3"
        >
          {parseInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-6 mb-3"
        >
          {parseInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-5 mb-2"
        >
          {parseInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("#### ")) {
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2"
        >
          {parseInline(line.slice(5))}
        </h4>
      );
      continue;
    }

    // 5. Blockquote (> text)
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          className="p-4 my-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-500 text-slate-700 dark:text-slate-300 italic text-sm"
        >
          {parseInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // 6. Horizontal Rule (--- or ***)
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(
        <hr key={`hr-${elements.length}`} className="my-6 border-slate-200 dark:border-slate-800" />
      );
      continue;
    }

    // 7. Paragraphs
    if (line.trim().length > 0) {
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed my-2.5"
        >
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
