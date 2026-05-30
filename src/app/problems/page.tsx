"use"
"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Bug
} from "lucide-react";

// Skeletons
import ProblemsSkeleton from "@/components/ProblemsSkeleton";

// JSON Datasets
import problemsData from "@/mock/problems.json";
import topicsData from "@/mock/topics.json";

function ProblemsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initial load simulation
  const [initialLoading, setInitialLoading] = useState(true);

  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");

  // Read URL query parameters for topic filtering (e.g. ?topic=nextjs-app-router)
  const initialTopicQuery = searchParams.get("topic") || "all";

  // State Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(initialTopicQuery);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all"); // "all" | "Easy" | "Medium" | "Hard"
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // "all" | "solved" | "attempted" | "unattempted"
  const [sortBy, setSortBy] = useState<string>("default"); // "default" | "difficulty" | "acceptance"

  // Sync search query parameter to state on mount
  useEffect(() => {
    if (initialTopicQuery !== "all") {
      setSelectedTopic(initialTopicQuery);
    }
  }, [initialTopicQuery]);

  // Debouncing effect for search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Simulate async mount load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Solve Statistics computations dynamically
  const solvedEasy = problemsData.filter(p => p.difficulty === "Easy" && p.userStatus === "solved").length;
  const totalEasy = problemsData.filter(p => p.difficulty === "Easy").length;

  const solvedMedium = problemsData.filter(p => p.difficulty === "Medium" && p.userStatus === "solved").length;
  const totalMedium = problemsData.filter(p => p.difficulty === "Medium").length;

  const solvedHard = problemsData.filter(p => p.difficulty === "Hard" && p.userStatus === "solved").length;
  const totalHard = problemsData.filter(p => p.difficulty === "Hard").length;

  const totalSolved = solvedEasy + solvedMedium + solvedHard;
  const totalProblems = problemsData.length;

  // Optimistic bookmarks list tracker
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter & Sort Logic execution
  const getFilteredProblems = () => {
    if (pageState === "empty") return [];

    let filtered = [...problemsData];

    // Search query matching
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
    }

    // Category / Topic matching
    if (selectedTopic !== "all") {
      // Find the topic title to match category or slug
      const matchedTopic = topicsData.find(t => t.slug === selectedTopic);
      if (matchedTopic) {
        // Simple heuristic: match category name inside problem title/tag
        filtered = filtered.filter(p => 
          p.category.toLowerCase().includes(matchedTopic.category.toLowerCase()) ||
          p.slug.includes(matchedTopic.slug) ||
          p.category.toLowerCase().includes(matchedTopic.title.toLowerCase().split(" ")[0].toLowerCase())
        );
      }
    }

    // Difficulty matching
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    // Status matching
    if (selectedStatus !== "all") {
      if (selectedStatus === "unattempted") {
        filtered = filtered.filter(p => p.userStatus === "unattempted" || !p.userStatus);
      } else {
        filtered = filtered.filter(p => p.userStatus === selectedStatus);
      }
    }

    // Sort matching
    if (sortBy === "difficulty") {
      const difficultyOrder: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (sortBy === "acceptance") {
      // Mock acceptance calculations
      filtered.sort((a, b) => b.solvedCount - a.solvedCount);
    }

    return filtered;
  };

  const processedProblems = getFilteredProblems();

  // Reset all filters action
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setSortBy("default");
    if (pageState === "empty") {
      setPageState("success");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } as const },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } as const }
  };

  if (initialLoading || pageState === "loading") {
    return <ProblemsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-4">
      
      {/* ========================================================================= */}
      {/* ERROR FALLBACK VIEW */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-dark">Curriculum Sync Failure</h2>
            <p className="text-sm text-muted-main leading-relaxed">
              ThinkEra could not load the active repository coding challenges because of a database connection timeout.
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
            <span>Reload Playground</span>
          </button>
        </div>
      )}

      {pageState !== "error" && (
        <AnimatePresence mode="wait">
          <motion.div
            key={pageState}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            
            {/* Header stats bar */}
            <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex flex-col gap-1 shrink-0 self-start sm:self-auto">
                <h1 className="text-xl font-extrabold text-dark tracking-tight leading-none flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <span>Interactive Playground</span>
                </h1>
                <p className="text-xs text-muted-main mt-1">
                  Sharpen your concepts and track solved metrics
                </p>
              </div>

              {/* Solved ratios dynamic visual bar */}
              <div className="flex-grow max-w-md w-full flex items-center gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-main leading-none">
                    <span>Solved Ratio</span>
                    <span className="text-dark font-extrabold">{totalSolved} / {totalProblems} Challenges</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(totalSolved / totalProblems) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Breakdown by difficulty display badges */}
              <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <div className="flex flex-col items-center px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <span className="text-[10px] font-bold text-emerald-800 leading-none">Easy</span>
                  <span className="text-xs font-bold text-emerald-900 mt-1">{solvedEasy} / {totalEasy}</span>
                </div>
                <div className="flex flex-col items-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                  <span className="text-[10px] font-bold text-amber-800 leading-none">Medium</span>
                  <span className="text-xs font-bold text-amber-900 mt-1">{solvedMedium} / {totalMedium}</span>
                </div>
                <div className="flex flex-col items-center px-3 py-1 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-[10px] font-bold text-red-800 leading-none">Hard</span>
                  <span className="text-xs font-bold text-red-900 mt-1">{solvedHard} / {totalHard}</span>
                </div>
              </div>
            </div>

            {/* Filter Bar Panel */}
            <div className="bg-white border border-border-main p-4 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-4 shadow-sm select-none">
              
              {/* Search Title text bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-main" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges by title..."
                  className="w-full pl-9 pr-4 py-2 border border-border-main rounded-xl text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-bg-main/30"
                />
              </div>

              {/* Dynamic Topic Dropdown Selection */}
              <div className="relative w-full lg:w-48">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-main rounded-xl text-xs font-semibold appearance-none bg-white pr-9 focus:outline-none focus:border-primary text-text-main"
                >
                  <option value="all">All Topics</option>
                  {topicsData.map(topic => (
                    <option key={topic.id} value={topic.slug}>{topic.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-main pointer-events-none" />
              </div>

              {/* Difficulty Selection Toggles */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl w-full lg:w-auto">
                <button
                  onClick={() => setSelectedDifficulty("all")}
                  className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === "all" ? "bg-white text-dark shadow-xs" : "text-muted-main hover:text-dark"
                  }`}
                >
                  All Diff
                </button>
                <button
                  onClick={() => setSelectedDifficulty("Easy")}
                  className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-xs" : "text-muted-main hover:text-dark"
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setSelectedDifficulty("Medium")}
                  className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-100 shadow-xs" : "text-muted-main hover:text-dark"
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setSelectedDifficulty("Hard")}
                  className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === "Hard" ? "bg-red-50 text-red-800 border border-red-100 shadow-xs" : "text-muted-main hover:text-dark"
                  }`}
                >
                  Hard
                </button>
              </div>

              {/* Completion Status Toggles */}
              <div className="relative w-full lg:w-40">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-main rounded-xl text-xs font-semibold appearance-none bg-white pr-9 focus:outline-none focus:border-primary text-text-main"
                >
                  <option value="all">All Statuses</option>
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                  <option value="unattempted">Unseen</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-main pointer-events-none" />
              </div>

              {/* Sort By selectors */}
              <div className="relative w-full lg:w-36">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-main rounded-xl text-xs font-semibold appearance-none bg-white pr-9 focus:outline-none focus:border-primary text-text-main"
                >
                  <option value="default">Default Sort</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="acceptance">Popularity</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-main pointer-events-none" />
              </div>

            </div>

            {/* Problems list body */}
            {processedProblems.length === 0 ? (
              
              /* ========================================================================= */
              /* NO PROBLEMS MATCH FILTER (EMPTY STATE FOR PROBLEMS) */
              /* ========================================================================= */
              <div className="bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm h-[320px]">
                <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-dark">No Challenges Match Filters</h3>
                <p className="text-xs text-muted-main max-w-xs leading-relaxed">
                  We couldn't find any coding problems matching your active keywords, category limits, or solved statuses.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              
              /* ========================================================================= */
              /* SUCCESS PROBLEMS POPULATED GRID */
              /* ========================================================================= */
              <>
                {/* 1. Desktop Tabular Grid */}
                <div className="bg-white border border-border-main rounded-2xl shadow-sm overflow-hidden hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border-main text-xs font-bold text-muted-main uppercase tracking-wider select-none">
                        <th className="py-4.5 px-6 w-16">#</th>
                        <th className="py-4.5 px-6">Title</th>
                        <th className="py-4.5 px-6 w-32">Difficulty</th>
                        <th className="py-4.5 px-6 w-36">Status</th>
                        <th className="py-4.5 px-6 w-36">Solves count</th>
                        <th className="py-4.5 px-6 w-20 text-center">Bookmark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-text-main">
                      {processedProblems.map((prob, idx) => {
                        const isBookmarked = bookmarks[prob.id] || false;
                        return (
                          <tr key={prob.id} className="hover:bg-bg-main/30 group transition-all">
                            <td className="py-4.5 px-6 text-muted-main">{idx + 1}</td>
                            <td className="py-4.5 px-6">
                              <Link
                                href={`/problems/${prob.slug}`}
                                className="font-bold text-dark group-hover:text-primary transition-colors text-sm hover:underline cursor-pointer"
                              >
                                {prob.title}
                              </Link>
                              <div className="flex gap-1.5 mt-1.5">
                                <span className="text-[9px] px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-muted-main rounded-md">
                                  {prob.category}
                                </span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold leading-none ${
                                prob.difficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                                prob.difficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                                "bg-red-50 text-red-800 border border-red-100"
                              }`}>
                                {prob.difficulty}
                              </span>
                            </td>
                            <td className="py-4.5 px-6">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold leading-none ${
                                prob.userStatus === "solved" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                                prob.userStatus === "attempted" ? "bg-amber-50 text-amber-800 border border-amber-100 animate-pulse" :
                                "bg-slate-100 text-muted-main border border-slate-200"
                              }`}>
                                {prob.userStatus === "solved" ? "Solved" :
                                 prob.userStatus === "attempted" ? "Attempted" : "Unseen"}
                              </span>
                            </td>
                            <td className="py-4.5 px-6 text-muted-main">
                              {prob.solvedCount} solves
                            </td>
                            <td className="py-4.5 px-6 text-center">
                              <button
                                onClick={() => toggleBookmark(prob.id)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isBookmarked
                                    ? "bg-amber-50 border-amber-200 text-amber-500"
                                    : "border-transparent text-muted-main hover:bg-slate-100 hover:text-dark"
                                }`}
                              >
                                <Bookmark className="h-4 w-4 fill-current" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Cards Grid */}
                <div className="flex flex-col gap-4 md:hidden">
                  {processedProblems.map((prob, idx) => {
                    const isBookmarked = bookmarks[prob.id] || false;
                    return (
                      <div key={prob.id} className="bg-white border border-border-main p-4 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-muted-main font-bold">Challenge #{idx + 1}</span>
                          <button
                            onClick={() => toggleBookmark(prob.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isBookmarked
                                ? "bg-amber-50 border-amber-200 text-amber-500"
                                : "border-transparent text-muted-main"
                            }`}
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </button>
                        </div>

                        <Link
                          href={`/problems/${prob.slug}`}
                          className="font-bold text-dark hover:text-primary transition-colors text-sm hover:underline cursor-pointer leading-snug"
                        >
                          {prob.title}
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                            prob.difficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                            prob.difficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                            "bg-red-50 text-red-800 border border-red-100"
                          }`}>
                            {prob.difficulty}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                            prob.userStatus === "solved" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                            prob.userStatus === "attempted" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                            "bg-slate-100 text-muted-main border border-slate-200"
                          }`}>
                            {prob.userStatus === "solved" ? "Solved" :
                             prob.userStatus === "attempted" ? "Attempted" : "Unseen"}
                          </span>
                          <span className="text-[9px] text-muted-main ml-auto font-bold">{prob.solvedCount} solves</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ========================================================================= */}
            {/* DEV-MODE STATE SANDBOX CONTROLLER */}
            {/* ========================================================================= */}
            <div className="fixed bottom-4 right-4 z-50 glassmorphism p-3 rounded-2xl shadow-lg border border-border-main max-w-xs flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="text-[10px] font-extrabold text-primary flex items-center gap-1 select-none">
                  <Bug className="h-3 w-3 text-primary" />
                  <span>DEV SANDBOX STATE CONTROLLER</span>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setPageState("success")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    pageState === "success" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Success View
                </button>
                <button
                  onClick={() => setPageState("loading")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "loading" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Loading View
                </button>
                <button
                  onClick={() => setPageState("empty")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    pageState === "empty" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  No Matches View
                </button>
                <button
                  onClick={() => setPageState("error")}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                    (pageState as string) === "error" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                  }`}
                >
                  Error View
                </button>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}

export default function ProblemsHub() {
  return (
    <Suspense fallback={<ProblemsSkeleton />}>
      <ProblemsList />
    </Suspense>
  );
}
