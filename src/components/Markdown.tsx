import React from "react";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code block check
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        inCodeBlock = false;
        elements.push(
          <pre key={`code-${i}`} className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-4 my-3 font-mono text-[11px] overflow-x-auto leading-relaxed select-text shadow-sm">
            <code className="block whitespace-pre select-text">
              {codeLines.join("\n")}
            </code>
          </pre>
        );
        codeLines = [];
        codeLang = "";
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    
    // Headers check
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xs font-extrabold text-slate-900 tracking-tight mt-5 mb-2.5 border-b border-slate-100 pb-1.5 uppercase tracking-wider">
          {renderInline(line.substring(4))}
        </h3>
      );
      continue;
    }
    
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-sm font-extrabold text-slate-900 tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2 uppercase tracking-wider">
          {renderInline(line.substring(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-base font-extrabold text-slate-900 tracking-tight mt-6 mb-3">
          {renderInline(line.substring(2))}
        </h1>
      );
      continue;
    }

    // List item check
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const bulletContent = line.trim().substring(2);
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2.5 my-1.5 pl-2 leading-relaxed">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
          <span className="text-[11px] sm:text-xs text-slate-700 font-medium">
            {renderInline(bulletContent)}
          </span>
        </div>
      );
      continue;
    }
    
    // Empty line check
    if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-2 select-none" />);
      continue;
    }
    
    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium">
        {renderInline(line)}
      </p>
    );
  }
  
  return <div className="flex flex-col gap-1.5 select-text">{elements}</div>;
}

// Inline parser for bold, inline code, etc.
function renderInline(text: string): React.ReactNode[] {
  // Let's tokenize the string
  // We can use a simple regex match to find **bold** and `code` markers
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-red-600 font-mono text-[10px] mx-0.5 select-text font-bold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
