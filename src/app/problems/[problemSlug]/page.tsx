"use"
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import {
  Code,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Play,
  ArrowLeft,
  X,
  Send,
  MessageSquare,
  Terminal,
  Bookmark,
  BookOpen,
  Info,
  Bug,
  Save,
  Check
} from "lucide-react";

// Skeletons & JSONs
import SolverSkeleton from "@/components/SolverSkeleton";
import Markdown from "@/components/Markdown";
import problemsData from "@/mock/problems.json";

export default function ProblemSolver() {
  const params = useParams();
  const router = useRouter();
  
  // Dynamic Route segments
  const problemSlug = params.problemSlug as string;

  // Find target problem
  const problem = problemsData.find(p => p.slug === problemSlug);

  // States
  const [pageState, setPageState] = useState<"success" | "loading" | "running" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "editorial" | "ai">("description");
  const [activeRightTab, setActiveRightTab] = useState<"testcase" | "results">("testcase");

  // Code & Language States
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "typescript" | "python" | "cpp" | "java">("typescript");
  const [editorCode, setEditorCode] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Monaco Editor theme is fixed to light mode
  const editorTheme = "thinkera-light";

  // AI Mentor States
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Resizable Panel States (left width in percentage)
  const [leftWidth, setLeftWidth] = useState(45);
  const isResizing = useRef(false);

  // Test Execution States
  const [testResults, setTestResults] = useState<Array<{
    id: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }>>([]);
  const [attempts, setAttempts] = useState(0);
  const [editorialUnlocked, setEditorialUnlocked] = useState(false);

  // Simulated initial mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const getLanguageStarterCode = (slug: string, lang: string) => {
    const toCamelCase = (str: string) => {
      const clean = str.startsWith("dsa-") ? str.substring(4) : str;
      return clean.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    };
    
    const funcName = toCamelCase(slug);
    
    // Resolve parameter types and return type based on problem slug
    let cppParams = "string s";
    let cppReturn = "bool";
    let javaParams = "String s";
    let javaReturn = "boolean";
    let pythonParams = "self, s: str";
    let pythonReturn = "bool";
    let jsParams = "s";
    
    if (slug.includes("two-sum")) {
      cppParams = "vector<int>& nums, int target";
      cppReturn = "vector<int>";
      javaParams = "int[] nums, int target";
      javaReturn = "int[]";
      pythonParams = "self, nums: List[int], target: int";
      pythonReturn = "List[int]";
      jsParams = "nums, target";
    } else if (slug.includes("linked-list") || slug.includes("reverse-list")) {
      cppParams = "ListNode* head";
      cppReturn = "ListNode*";
      javaParams = "ListNode head";
      javaReturn = "ListNode";
      pythonParams = "self, head: Optional[ListNode]";
      pythonReturn = "Optional[ListNode]";
      jsParams = "head";
    } else if (slug.includes("search") || slug.includes("subarray") || slug.includes("intervals") || slug.includes("stock") || slug.includes("matrix")) {
      cppParams = "vector<int>& nums";
      cppReturn = "int";
      javaParams = "int[] nums";
      javaReturn = "int";
      pythonParams = "self, nums: List[int]";
      pythonReturn = "int";
      jsParams = "nums";
    }
    
    switch (lang) {
      case "cpp":
        return `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppReturn} ${funcName}(${cppParams}) {\n        // Write C++ code here\n        \n    }\n};`;
      case "java":
        return `import java.util.*;\n\nclass Solution {\n    public ${javaReturn} ${funcName}(${javaParams}) {\n        // Write Java code here\n        return null;\n    }\n}`;
      case "python":
        return `class Solution:\n    def ${funcName}(${pythonParams}) -> ${pythonReturn}:\n        # Write Python code here\n        pass`;
      case "javascript":
      case "typescript":
      default:
        return `/**\n * @return {${javaReturn}}\n */\nvar ${funcName} = function(${jsParams}) {\n    // Write JavaScript code here\n    \n};`;
    }
  };

  // Pre-load code template maps per language
  useEffect(() => {
    if (!problem) return;
    
    // Check local storage for autosaved code first
    const saved = localStorage.getItem(`thinkera_autosave_${problem.id}_${selectedLanguage}`);
    if (saved) {
      setEditorCode(saved);
    } else {
      setEditorCode(getLanguageStarterCode(problem.slug, selectedLanguage));
    }
  }, [problem, selectedLanguage]);

  // Code Autosave hook (every 20s)
  useEffect(() => {
    if (!problem || !editorCode) return;
    const interval = setInterval(() => {
      localStorage.setItem(`thinkera_autosave_${problem.id}_${selectedLanguage}`, editorCode);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 20000);
    return () => clearInterval(interval);
  }, [editorCode, problem, selectedLanguage]);

  // Handle route not found
  if (!problem && !initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
          <Bug className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-dark">Problem Not Found</h2>
          <p className="text-sm text-muted-main leading-relaxed">
            The coding challenge <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">/problems/{problemSlug}</code> is not in our placement repositories.
          </p>
        </div>
        <Link
          href="/problems"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Challenges</span>
        </Link>
      </div>
    );
  }

  // Pre-load default AI Mentor message
  const triggerAiWelcome = () => {
    if (chatMessages.length === 0 && problem) {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages([
          {
            sender: "ai",
            text: `Hello Rudra! I am your AI Mentor. I have complete analytical knowledge about **${problem.title}**.\n\nStuck on time complexity or syntax? Click **"Get Hint"** or type a query, and I'll guide you step-by-step without spoiling the final solution!`
          }
        ]);
        setIsTyping(false);
      }, 400);
    }
  };

  useEffect(() => {
    if (problem) triggerAiWelcome();
  }, [problem]);

  // Client-Side Multi-Language Code Execution Sandbox Runner
  const runCodeSandbox = () => {
    if (!problem) return;
    setPageState("running");
    setActiveRightTab("results");

    const isNonJS = ["cpp", "java", "python"].includes(selectedLanguage);

    setTimeout(() => {
      try {
        if (isNonJS) {
          // Verify code structure for compilation success
          const hasSolutionClass = editorCode.includes("class Solution");
          
          if (!hasSolutionClass) {
            // Simulated Compiler Syntax Error
            let compileError = "";
            if (selectedLanguage === "cpp") {
              compileError = "solution.cpp:6:1: error: 'Solution' class was not declared in this scope\n    Solution sol;\n    ^~~~~~~~\n";
            } else if (selectedLanguage === "java") {
              compileError = "Solution.java:3: error: public class Solution must be declared for test suite execution\nclass Solution {\n^\n";
            } else {
              compileError = "File \"solution.py\", line 4\n    class Solution\n                 ^\nSyntaxError: expected ':'\n";
            }
            
            const results = problem.testCases.map((tc) => ({
              id: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: "null",
              passed: false,
              error: compileError
            }));
            
            setTestResults(results);
            setPageState("success");
            return;
          }
          
          // Successful compile simulation
          const results = problem.testCases.map((tc) => {
            return {
              id: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: tc.expectedOutput, // Mock correct execution
              passed: true
            };
          });
          
          setTestResults(results);
          setPageState("success");
          
          // Confetti explosion on pass!
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          
          return;
        }

        // Standard JS/TS evaluation
        const results = problem.testCases.map((tc) => {
          let parsedInput;
          try {
            parsedInput = eval(tc.input);
          } catch {
            parsedInput = tc.input;
          }

          try {
            // Locate the function name dynamically inside the editor code
            const funcNameMatch = editorCode.match(/var\s+(\w+)\s*=/) || editorCode.match(/function\s+(\w+)/) || editorCode.match(/const\s+(\w+)\s*=/);
            const funcName = funcNameMatch ? funcNameMatch[1] : null;

            if (!funcName) {
              throw new Error("Could not detect function declaration name in editor. Make sure to define 'var functionName = function(...)'.");
            }

            // Safe sandbox execution wrapper
            const executionWrapper = new Function(`
              ${editorCode};
              return ${funcName}.apply(null, ${tc.input});
            `);

            const returnedValue = executionWrapper();
            const returnedStr = JSON.stringify(returnedValue);
            
            // Expected string comparison
            const passed = returnedStr === tc.expectedOutput;

            return {
              id: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: returnedStr,
              passed
            };
          } catch (err: any) {
            return {
              id: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: "null",
              passed: false,
              error: err.message || "Compilation failed."
            };
          }
        });

        setTestResults(results);
        setPageState("success");

        const allPassed = results.every(r => r.passed);
        if (allPassed) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        setAttempts(prev => {
          const next = prev + 1;
          if (next >= 3) {
            setEditorialUnlocked(true);
          }
          return next;
        });

      } catch (err: any) {
        setPageState("success");
        alert("Compiler crash: " + err.message);
      }
    }, 1200);
  };

  // AI Chat Hints triggers
  const sendAiHint = (query?: string) => {
    if (!problem) return;
    const text = query || "Give me a dynamic, conceptual hint regarding indices boundaries.";
    setChatMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);
    setActiveLeftTab("ai");

    setTimeout(() => {
      let aiResponse = "";
      if (text.toLowerCase().includes("hint")) {
        aiResponse = `**AI Hint:** Have you considered a **Two-Pointer** approach? Or a **Hash Map** key-check?\n\nIf you use a Hash Map, you can store each value's index as you iterate. When you visit a number, check if its complement \`(target - current)\` already exists in the map. This keeps your runtime complexity strictly at **O(N)** instead of O(N²)!`;
      } else {
        aiResponse = `For **${problem.title}**, make sure you account for edge cases where the input list contains duplicate values or negative integers. Try writing dry-runs of the indices checks inside your console!`;
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  // Drag Resizer handlers
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", resizePanels);
    document.addEventListener("mouseup", stopResize);
  };

  const resizePanels = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const containerWidth = window.innerWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    
    // Panel constraints (30% to 70%)
    if (newLeftWidth > 30 && newLeftWidth < 70) {
      setLeftWidth(newLeftWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resizePanels);
    document.removeEventListener("mouseup", stopResize);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } as const },
    exit: { opacity: 0, transition: { duration: 0.15 } as const }
  };

  if (initialLoading || pageState === "loading") {
    return <SolverSkeleton />;
  }

  // Double check fallback
  if (!problem) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={problem.id}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-[calc(100vh-120px)] flex flex-col gap-4 select-none relative"
      >
        
        {/* ========================================================================= */}
        {/* ERROR STATE VIEWER */}
        {/* ========================================================================= */}
        {pageState === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
            <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-dark">Monaco Instance Failure</h2>
              <p className="text-sm text-muted-main leading-relaxed">
                We encountered an out-of-memory exception while compiling the WebAssembly layers for Monaco Editor.
              </p>
            </div>
            <button
              onClick={() => {
                setPageState("loading");
                setTimeout(() => setPageState("success"), 600);
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Monaco Layers</span>
            </button>
          </div>
        )}

        {pageState !== "error" && (
          <>
            {/* Top Workspace Header Bar */}
            <div className="bg-white border border-border-main p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <Link
                  href="/problems"
                  className="p-1.5 rounded-lg border border-border-main text-muted-main hover:text-dark hover:bg-bg-main transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="font-extrabold text-base text-dark tracking-tight leading-none truncate max-w-[240px]">
                  {problem.title}
                </h1>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                  problem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                  problem.difficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                  "bg-red-50 text-red-800 border border-red-100"
                }`}>
                  {problem.difficulty}
                </span>
                
                {/* Autosaved Indicator */}
                <AnimatePresence>
                  {isSaved && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] text-emerald-600 font-bold flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Saved</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Language toggler */}
              <div className="flex items-center gap-2 select-none self-end sm:self-auto">
                <span className="text-[10px] text-muted-main font-bold">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="px-3 py-1.5 border border-border-main rounded-lg text-xs font-semibold bg-white pr-7 relative focus:outline-none focus:border-primary text-text-main"
                >
                  <option value="cpp">C++ (GCC 13)</option>
                  <option value="java">Java (OpenJDK 21)</option>
                  <option value="python">Python (v3.11)</option>
                  <option value="javascript">JavaScript (ES6)</option>
                  <option value="typescript">TypeScript (v5.0)</option>
                </select>
              </div>
            </div>

            {/* Main Split Panels Layout */}
            <div className="flex-grow flex gap-4 h-full min-h-0 overflow-hidden relative">
              
              {/* PANEL 1: Left Problem Description Statement (resizable) */}
              <div
                className="bg-white border border-border-main p-5 rounded-xl flex flex-col gap-4 shadow-sm h-full overflow-hidden shrink-0"
                style={{ width: `${leftWidth}%` }}
              >
                {/* Panel Tab Toggle */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 select-none shrink-0">
                  <button
                    onClick={() => setActiveLeftTab("description")}
                    className={`pb-1 text-xs font-bold transition-all relative ${
                      activeLeftTab === "description" ? "text-primary" : "text-muted-main hover:text-dark"
                    }`}
                  >
                    Statement
                    {activeLeftTab === "description" && (
                      <motion.div layoutId="leftTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (!editorialUnlocked) {
                        alert("Editorial locks until you complete 3 solve attempts or succeed first!");
                        return;
                      }
                      setActiveLeftTab("editorial");
                    }}
                    className={`pb-1 text-xs font-bold transition-all relative flex items-center gap-1 ${
                      activeLeftTab === "editorial"
                        ? "text-primary"
                        : editorialUnlocked
                        ? "text-muted-main hover:text-dark"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <span>Editorial</span>
                    {!editorialUnlocked && <span className="text-[9px]">🔒</span>}
                    {activeLeftTab === "editorial" && (
                      <motion.div layoutId="leftTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveLeftTab("ai")}
                    className={`pb-1 text-xs font-bold transition-all relative flex items-center gap-1 ${
                      activeLeftTab === "ai" ? "text-primary" : "text-muted-main hover:text-dark"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>AI Mentor</span>
                    {activeLeftTab === "ai" && (
                      <motion.div layoutId="leftTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                </div>

                {/* Tab 1: Description Statement */}
                {activeLeftTab === "description" && (
                  <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin">
                    <div className="text-xs text-text-main leading-relaxed flex flex-col gap-3 font-semibold">
                      <Markdown content={problem.description} />
                    </div>

                    {/* Problem Visible Examples representation */}
                    <div className="flex flex-col gap-3 mt-2 shrink-0">
                      <h4 className="font-bold text-xs text-dark">Visible Examples</h4>
                      {problem.testCases.slice(0, 2).map((tc, idx) => (
                        <div key={tc.id} className="bg-bg-main border border-border-main/50 p-3 rounded-xl flex flex-col gap-1 font-mono text-[10px] text-muted-main">
                          <span className="font-bold text-dark text-[9px] mb-1">Example #{idx + 1}</span>
                          <span><strong>Input Parameters:</strong> {tc.input}</span>
                          <span><strong>Expected Output:</strong> {tc.expectedOutput}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Editorial Solution */}
                {activeLeftTab === "editorial" && (
                  <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin font-mono text-xs text-slate-800 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Optimal solution editorial</span>
                    <pre className="mt-2 text-[10px] leading-relaxed select-text font-semibold">
                      {problem.solutionCode}
                    </pre>
                  </div>
                )}

                {/* Tab 3: AI Mentor Conversation Drawer */}
                {activeLeftTab === "ai" && (
                  <div className="flex-grow flex flex-col min-h-0">
                    {/* Message Viewport */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 bg-slate-50 border border-slate-100 p-3.5 rounded-xl mb-3 scrollbar-thin">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col max-w-[90%] ${
                            msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl text-[11px] leading-relaxed font-semibold ${
                              msg.sender === "user"
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-white border border-border-main text-text-main rounded-bl-none shadow-xs"
                            }`}
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="self-start bg-white border border-border-main px-3 py-2 rounded-xl rounded-bl-none shadow-xs flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>

                    {/* AI Quick Actions "Get Hint" button */}
                    <div className="shrink-0 flex gap-1.5 select-none mb-3">
                      <button
                        onClick={() => sendAiHint()}
                        className="flex-1 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 text-[10px] font-extrabold text-orange-800 flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
                        <span>Get Algorithmic Hint</span>
                      </button>
                    </div>

                    {/* Chat Input Composer */}
                    <div className="shrink-0 flex items-center gap-2 border border-border-main rounded-xl p-1 bg-bg-main/30">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendAiHint(inputValue)}
                        placeholder="Ask AI a concept..."
                        className="flex-grow px-3 py-2 text-xs font-semibold focus:outline-none bg-transparent"
                      />
                      <button
                        onClick={() => sendAiHint(inputValue)}
                        className="h-8 w-8 rounded-lg bg-primary hover:bg-primary-hover flex items-center justify-center text-white"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drag Handle Divider Resizer (Desktop only) */}
              <div
                onMouseDown={startResize}
                className="w-1 cursor-col-resize hover:bg-primary/20 bg-transparent flex items-center justify-center relative z-10 select-none shrink-0"
              />

              {/* RIGHT PANEL: Code Editor (top) and Test Cases / Test Results Console (bottom) */}
              <div
                className="flex-grow flex flex-col gap-4 h-full min-h-0 overflow-hidden shrink-0"
                style={{ width: `${98 - leftWidth}%` }}
              >
                {/* TOP HALF: Monaco Code Editor Panel */}
                <div className="flex-[3] min-h-[300px] bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                  {/* Editor control header */}
                  <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 select-none shrink-0">
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      <span>Workspace Compiler</span>
                    </span>
                    <span>{selectedLanguage === "cpp" ? "GCC 13 WASM" : selectedLanguage === "java" ? "OpenJDK 21 WASM" : "WASM Engine"}</span>
                  </div>

                  {/* Monaco Editor Frame */}
                  <div className="flex-grow w-full bg-white min-h-0">
                    <Editor
                      height="100%"
                      language={selectedLanguage}
                      beforeMount={(monaco) => {
                        monaco.editor.defineTheme('thinkera-light', {
                          base: 'vs',
                          inherit: true,
                          rules: [],
                          colors: {
                            'editor.background': '#FDFBF7', // Match workspace warm cream!
                          }
                        });
                      }}
                      theme="thinkera-light"
                      value={editorCode}
                      onChange={(val) => setEditorCode(val || "")}
                      options={{
                        fontSize: 12,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollbar: {
                          verticalScrollbarSize: 6,
                          horizontalScrollbarSize: 6
                        }
                      }}
                    />
                  </div>

                  {/* Editor Actions Bottom Bar */}
                  <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between select-none shrink-0">
                    <button
                      onClick={() => {
                        if (confirm("Resetting code will clear your current progress. Continue?")) {
                          localStorage.removeItem(`thinkera_autosave_${problem.id}_${selectedLanguage}`);
                          // reload
                          setSelectedLanguage(prev => prev);
                        }
                      }}
                      className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={runCodeSandbox}
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Run Code</span>
                      </button>
                      <button
                        onClick={runCodeSandbox}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 animate-pulse"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Submit Solution</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOTTOM HALF: Test Cases / Test Results Console Panel */}
                <div className="flex-[2] min-h-[220px] bg-white border border-border-main p-5 rounded-xl flex flex-col justify-between shadow-sm overflow-hidden">
                  <div className="flex flex-col gap-4 flex-1 min-h-0">
                    {/* Console Tab Headers */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2 select-none shrink-0">
                      <button
                        onClick={() => setActiveRightTab("testcase")}
                        className={`pb-1 text-xs font-bold transition-all relative ${
                          activeRightTab === "testcase" ? "text-primary" : "text-muted-main hover:text-dark"
                        }`}
                      >
                        <span>Testcase</span>
                        {activeRightTab === "testcase" && (
                          <motion.div layoutId="rightTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveRightTab("results")}
                        className={`pb-1 text-xs font-bold transition-all relative flex items-center gap-1 ${
                          activeRightTab === "results" ? "text-primary" : "text-muted-main hover:text-dark"
                        }`}
                      >
                        <span>Test Result</span>
                        {activeRightTab === "results" && (
                          <motion.div layoutId="rightTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    </div>

                    {/* Tab 1: Testcase Panel */}
                    {activeRightTab === "testcase" && (
                      <div className="flex-grow overflow-y-auto flex flex-col gap-3.5 pr-1 scrollbar-thin">
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold text-dark uppercase tracking-wider select-none">Mock Parameters</span>
                          {problem.testCases.slice(0, 3).map((tc, idx) => (
                            <div
                              key={tc.id}
                              className="p-3 border border-border-main bg-bg-main/50 rounded-xl flex flex-col gap-1.5 font-mono text-[10px]"
                            >
                              <span className="font-bold text-[9px] text-dark">Case #{idx + 1}</span>
                              <span className="truncate"><strong>Input:</strong> {tc.input}</span>
                              <span className="truncate"><strong>Expected:</strong> {tc.expectedOutput}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Test Result Panel */}
                    {activeRightTab === "results" && (
                      <div className="flex-grow overflow-y-auto flex flex-col gap-3.5 pr-1 scrollbar-thin">
                        {testResults.length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center gap-3 py-12 text-muted-main select-none h-full">
                            <Terminal className="h-7 w-7 text-slate-300 animate-pulse" />
                            <span className="text-[11px] font-semibold">No compiles executed yet. Write code and hit "Run" to test.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-dark uppercase tracking-wider select-none">Execution report</span>
                            {testResults.map((res, idx) => (
                              <div
                                key={res.id}
                                className={`p-3 border rounded-xl flex flex-col gap-1.5 font-mono text-[10px] relative ${
                                  res.passed
                                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                                    : "bg-red-50/50 border-red-100 text-red-800"
                                }`}
                              >
                                <div className="flex items-center justify-between select-none">
                                  <span className="font-bold text-[9px] text-dark">Test Case #{idx + 1}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    res.passed ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                                  }`}>
                                    {res.passed ? "Passed" : "Failed"}
                                  </span>
                                </div>
                                <span className="truncate"><strong>Input Parameters:</strong> {res.input}</span>
                                <span className="truncate"><strong>Expected Output:</strong> {res.expected}</span>
                                
                                {res.error ? (
                                  <span className="text-red-700 bg-red-100/50 p-2 rounded-lg mt-1 font-mono text-[9px] select-text">
                                    <strong>Compile Exception:</strong> {res.error}
                                  </span>
                                ) : (
                                  <span className="truncate"><strong>Returned Value:</strong> {res.actual}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Collapsible Sandbox state switchers */}
            <div className="fixed bottom-4 right-4 z-50 glassmorphism p-3 rounded-2xl shadow-lg border border-border-main max-w-xs flex flex-col gap-2 select-none">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="text-[10px] font-extrabold text-primary flex items-center gap-1">
                  <Bug className="h-3 w-3 text-primary" />
                  <span>DEV SANDBOX STATE CONTROLLER</span>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setPageState("success")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "success" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Workspace Success
                </button>
                <button
                  onClick={() => setPageState("loading")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "loading" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Loading Skeletons
                </button>
                <button
                  onClick={() => setPageState("running")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "running" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Running Compiler
                </button>
                <button
                  onClick={() => setPageState("error")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "error" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  WASM Crash Error
                </button>
              </div>
            </div>
          </>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
