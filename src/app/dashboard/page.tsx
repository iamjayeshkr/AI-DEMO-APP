"use"
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Award,
  BookOpen,
  Compass,
  Code,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Plus,
  Minus,
  MessageSquare,
  AlertTriangle,
  Play,
  CheckCircle,
  HelpCircle,
  Bug
} from "lucide-react";

// Import Skeletons & Widgets
import DashboardSkeleton from "@/components/DashboardSkeleton";
import ProgressRing from "@/components/ProgressRing";

// Static Imports of Mock JSONs for Client Simulation
import topicsData from "@/mock/topics.json";
import problemsData from "@/mock/problems.json";
import communityData from "@/mock/community.json";
import usersData from "@/mock/users.json";

export default function Dashboard() {
  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");
  
  // Custom Dynamic State Settings (Optimistic Daily Goal)
  const [dailyProblemGoal, setDailyProblemGoal] = useState(3);
  const [problemsSolvedToday, setProblemsSolvedToday] = useState(1);
  const [showGoalNotification, setShowGoalNotification] = useState(false);

  // Simulated Async Loading Effect on Initial Load
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handler for Daily Goal adjustment (Optimistic UI updates)
  const adjustGoal = (amount: number) => {
    setDailyProblemGoal(prev => {
      const next = Math.max(1, prev + amount);
      if (next === problemsSolvedToday) {
        setShowGoalNotification(true);
        setTimeout(() => setShowGoalNotification(false), 3000);
      }
      return next;
    });
  };

  // Mock User reference from users.json (Rudra Dev)
  const user = usersData[0]; // Student
  const admin = usersData[1]; // Admin

  // Recommended Problems filtration (attempted/unseen first)
  const recommendedProblems = problemsData.filter(p => p.userStatus !== "solved").slice(0, 3);

  // Continue Learning Topic
  const activeTopic = topicsData.find(t => t.progress > 0 && t.progress < 100) || topicsData[0];

  // Global Page Slide+Fade transitions
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } as const },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } as const }
  };

  // Render content based on active state
  if (initialLoading || pageState === "loading") {
    return <DashboardSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageState}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        
        {/* ========================================================================= */}
        {/* ERROR STATE VIEW */}
        {/* ========================================================================= */}
        {pageState === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
            <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-dark">Data Synchronization Failed</h2>
              <p className="text-sm text-muted-main leading-relaxed">
                We encountered a network timeout while attempting to sync your roadmap progress and streak logs with the PostgreSQL backend.
              </p>
            </div>
            <button
              onClick={() => {
                setPageState("loading");
                setTimeout(() => setPageState("success"), 800);
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Syncing Session</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EMPTY STATE VIEW (New User) */}
        {/* ========================================================================= */}
        {pageState === "empty" && (
          <div className="flex flex-col gap-8 py-4 max-w-7xl mx-auto">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col items-start gap-4">
              <div className="absolute top-[-40%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px]" />
              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
                🏁 Let's Begin Your Journey
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-xl text-white">
                Welcome to ThinkEra, {user.name}! Let's create your DSA roadmap.
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed mt-1">
                You haven't completed onboarding preferences or started learning tracks yet. Personalize your placement preferences to unlock curated coding challenges and a customized learning roadmap.
              </p>
              <button
                onClick={() => alert("Mock Onboarding Flow Triggered")}
                className="mt-4 px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-blue-50 transition-all flex items-center gap-2 group"
              >
                <span>Complete Onboarding Setup</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Inactive Widget Grids representations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-4 shadow-sm items-center text-center py-10">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-dark">Visual Roadmap Nodes</h3>
                <p className="text-xs text-muted-main max-w-xs leading-relaxed">
                  Unlock dynamic phase maps displaying prerequisites, topic modules, and direct YouTube/Blog study integrations.
                </p>
                <Link href="/roadmap" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mt-1">
                  <span>Preview Roadmap Path</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-4 shadow-sm items-center text-center py-10">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-dark">Interactive Playground</h3>
                <p className="text-xs text-muted-main max-w-xs leading-relaxed">
                  Challenge yourself with coding exercises ranging from simple Array Dynamic Segment routers to advanced Dynamic Programming locks.
                </p>
                <Link href="/problems" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mt-1">
                  <span>Browse Problems</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUCCESS STATE VIEW */}
        {/* ========================================================================= */}
        {pageState === "success" && (
          <div className="flex flex-col gap-8 py-4 max-w-7xl mx-auto">
            
            {/* Header Greeting & Streak metrics */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-main pb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold text-dark tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm text-muted-main">
                  Level {user.level} Student | Track: <span className="font-semibold text-primary">{user.activePlan}</span>
                </p>
              </div>

              {/* Flame Streak Pulse badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-800 shadow-sm select-none hover:scale-105 active:scale-95 transition-all">
                <div className="h-9 w-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 animate-pulse text-lg">
                  🔥
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-sm font-extrabold">{user.streak}-Day Streak!</span>
                  <span className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-wider">Secure your flame today</span>
                </div>
              </div>
            </div>

            {/* 3-Column Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Widget 1: Roadmap SVG Progress Ring */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-dark tracking-tight flex items-center gap-2">
                    <Compass className="h-4.5 w-4.5 text-primary" />
                    <span>Roadmap Progress</span>
                  </h3>
                  <Link href="/roadmap" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                    <span>Full Map</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2">
                  <ProgressRing percentage={34} size={135} strokeWidth={9} />
                  <p className="text-xs text-muted-main text-center leading-relaxed max-w-[200px]">
                    You have unlocked <span className="font-bold text-dark">5 out of 15</span> nodes on the core DSA tracks.
                  </p>
                </div>
              </div>

              {/* Widget 2: Today's Problems Goal */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-dark tracking-tight flex items-center gap-2">
                    <Code className="h-4.5 w-4.5 text-primary" />
                    <span>Today's Challenges</span>
                  </h3>
                  
                  {/* Daily Goal Editor */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg p-0.5 select-none">
                    <button
                      onClick={() => adjustGoal(-1)}
                      className="p-1 rounded hover:bg-white text-muted-main hover:text-dark transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] font-extrabold text-dark px-1 min-w-[26px] text-center">
                      Goal: {dailyProblemGoal}
                    </span>
                    <button
                      onClick={() => adjustGoal(1)}
                      className="p-1 rounded hover:bg-white text-muted-main hover:text-dark transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Progress Metric details */}
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-text-main">
                    <span>Solve Progress</span>
                    <span className="text-primary">{problemsSolvedToday} / {dailyProblemGoal} Completed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (problemsSolvedToday / dailyProblemGoal) * 100)}%` }}
                      className="h-full bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 80 }}
                    />
                  </div>

                  <AnimatePresence>
                    {showGoalNotification && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 rounded-lg font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Awesome! Daily goal successfully matched! 🎉</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Curated list of recommended active problems */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    {recommendedProblems.map((prob) => (
                      <Link
                        key={prob.id}
                        href={`/problems/${prob.slug}`}
                        className="flex items-center justify-between p-2.5 border border-slate-100 hover:bg-bg-main hover:border-slate-200 rounded-xl transition-all group cursor-pointer"
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-xs font-bold text-dark group-hover:text-primary transition-colors leading-none truncate max-w-[170px]">
                            {prob.title}
                          </span>
                          <span className={`text-[9px] font-bold mt-1 leading-none ${
                            prob.difficulty === "Easy" ? "text-emerald-700" :
                            prob.difficulty === "Medium" ? "text-amber-700" : "text-red-700"
                          }`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/5 border border-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
                          Start
                        </span>
                      </Link>
                    ))}
                  </div>

                </div>
              </div>

              {/* Widget 3: Recent Activity Log */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-dark tracking-tight flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" />
                    <span>Recent Activity</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-muted-main rounded-full">
                    +{user.xp} Total XP
                  </span>
                </div>

                <div className="flex flex-col gap-4 flex-grow overflow-y-auto max-h-[190px]">
                  {user.recentActivity.map((act) => (
                    <div key={act.activityId} className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                        act.type === "solved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {act.type === "solved" ? "💻" : "📹"}
                      </div>
                      <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-text-main leading-snug font-semibold truncate w-full">
                          {act.type === "solved" ? "Solved: " : "Studied: "}{act.targetName}
                        </p>
                        <span className="text-[10px] text-muted-main">
                          +{act.xpGained} XP Earned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Row 2: Continue Learning widget + Focus Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Continue Learning Widget (Spans 2 columns) */}
              <div className="lg:col-span-2 bg-white border border-border-main p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-64">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active Learning Topic</span>
                  <h2 className="text-xl font-bold text-dark leading-tight mt-[-2px]">
                    {activeTopic.title}
                  </h2>
                  <p className="text-xs text-muted-main leading-relaxed mt-0.5 max-w-xl">
                    Resume where you left off. Next Module: <span className="font-bold text-text-main">{activeTopic.modules.find(m => m.status === "in-progress")?.title || activeTopic.modules[2].title}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-main leading-none">
                      <span>Overall Progress</span>
                      <span className="text-dark font-extrabold">{activeTopic.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${activeTopic.progress}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/learn/${activeTopic.slug}`}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 group"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Resume Studying</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Focus Stats Widget */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-64">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-sm text-dark tracking-tight flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-primary" />
                    <span>Focus Stats Today</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-3 bg-bg-main border border-border-main/50 rounded-xl flex flex-col gap-0.5 items-center justify-center">
                      <span className="text-xl font-extrabold text-dark leading-none">2</span>
                      <span className="text-[10px] text-muted-main font-bold mt-1 uppercase tracking-wider">Sessions Done</span>
                    </div>
                    <div className="p-3 bg-bg-main border border-border-main/50 rounded-xl flex flex-col gap-0.5 items-center justify-center">
                      <span className="text-xl font-extrabold text-dark leading-none">50m</span>
                      <span className="text-[10px] text-muted-main font-bold mt-1 uppercase tracking-wider">Minutes Logged</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/focus"
                  className="w-full py-2.5 border border-primary text-primary hover:bg-primary/5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start Focus Session</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>

            {/* Row 3: Community doubt highlight shortcuts */}
            <div className="bg-white border border-border-main p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-dark tracking-tight flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  <span>Trending Community Doubts</span>
                </h3>
                <Link href="/community/doubts" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                  <span>View All Doubts</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityData.slice(0, 2).map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/post/${post.id}`}
                    className="p-4 border border-slate-100 hover:bg-bg-main hover:border-slate-200 rounded-xl transition-all flex flex-col gap-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                        post.replies.length > 0
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : "bg-orange-50 text-orange-800 border border-orange-100"
                      }`}>
                        {post.replies.length > 0 ? "Resolved" : "Open Doubt"}
                      </span>
                      <span className="text-[10px] text-muted-main">{post.category}</span>
                    </div>
                    <h4 className="font-bold text-xs text-dark group-hover:text-primary transition-colors leading-snug truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <img src={post.author.avatar} alt={post.author.name} className="h-4 w-4 rounded-full border border-border-main" />
                        <span className="text-[10px] text-text-main font-semibold">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-main text-[10px] font-bold">
                        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> {post.replies.length}</span>
                        <span className="flex items-center gap-0.5">▲ {post.upvotes}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
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
              Empty (New User)
            </button>
            <button
              onClick={() => setPageState("error")}
              className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                pageState === "error" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
              }`}
            >
              Error View
            </button>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
