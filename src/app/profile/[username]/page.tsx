"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Award,
  Calendar,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowLeft,
  Settings,
  Bug,
  AlertTriangle,
  RotateCcw,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";
import ProgressRing from "@/components/ProgressRing";

// Interfaces from mock database
interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ActivityLog {
  activityId: string;
  type: "solved" | "read" | "watched" | "focus";
  targetName: string;
  timestamp: string;
  xpGained: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  streak: number;
  level: number;
  xp: number;
  badges: Badge[];
  joinedAt: string;
  solvedCount: number;
  activePlan: string;
  recentActivity: ActivityLog[];
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();

  // dynamic parameter: rudra-dev or others
  const username = params.username as string;

  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true);

  // Student Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Custom states that might be edited in Settings
  const [displayName, setDisplayName] = useState("Rudra Dev");

  // Simulated async mock-loading & localStorage recovery
  useEffect(() => {
    // Attempt settings name sync first
    try {
      const savedName = localStorage.getItem("thinkera_settings_name");
      if (savedName) setDisplayName(JSON.parse(savedName));

      // Fetch profile
      const savedProfile = localStorage.getItem("thinkera_student_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // Sync display name
        if (savedName) parsed.name = JSON.parse(savedName);
        setProfile(parsed);
      } else {
        // Initial setup from default mock database
        const initialMockProfile: UserProfile = {
          id: "user-student-1",
          email: "student@thinkera.io",
          name: savedName ? JSON.parse(savedName) : "Rudra Dev",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra",
          role: "student",
          streak: 14,
          level: 3,
          xp: 1840,
          badges: [
            {
              id: "badge-1",
              name: "First Solve",
              icon: "🏆",
              description: "Completed first coding challenge."
            },
            {
              id: "badge-2",
              name: "2-Week Streak",
              icon: "🔥",
              description: "Logged in and completed activities 14 days in a row."
            },
            {
              id: "badge-3",
              name: "Deep Focus Master",
              icon: "🧘",
              description: "Completed at least 5 focus sessions."
            }
          ],
          joinedAt: "2026-04-12T00:00:00Z",
          solvedCount: 12,
          activePlan: "Pro Learner",
          recentActivity: [
            {
              activityId: "act-1",
              type: "solved",
              targetName: "Build a Next.js Dynamic Segment Router",
              timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
              xpGained: 50
            },
            {
              activityId: "act-2",
              type: "focus",
              targetName: "Arrays Practice deep study session",
              timestamp: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
              xpGained: 30
            },
            {
              activityId: "act-3",
              type: "read",
              targetName: "Introduction to App Router & Routing blog",
              timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
              xpGained: 20
            },
            {
              activityId: "act-4",
              type: "solved",
              targetName: "Two Sum problem solving",
              timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
              xpGained: 50
            }
          ]
        };
        setProfile(initialMockProfile);
        localStorage.setItem("thinkera_student_profile", JSON.stringify(initialMockProfile));
      }
    } catch (e) {
      console.error("Localstorage recovery failed", e);
    }

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [username]);

  // Sync state variations inside developer sandbox
  useEffect(() => {
    if (pageState === "empty" && profile) {
      setProfile({
        ...profile,
        solvedCount: 0,
        streak: 0,
        xp: 0,
        level: 1,
        badges: [],
        recentActivity: []
      });
    } else if (pageState === "success") {
      try {
        const savedProfile = localStorage.getItem("thinkera_student_profile");
        const savedName = localStorage.getItem("thinkera_settings_name");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (savedName) parsed.name = JSON.parse(savedName);
          setProfile(parsed);
        }
      } catch (e) {}
    }
  }, [pageState]);

  // Calculations for profile metrics
  const nextLevelXp = 3000;
  const xpPercentage = profile ? Math.round((profile.xp / nextLevelXp) * 100) : 0;
  const joinedDate = profile ? new Date(profile.joinedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";

  // Reset corrupted data
  const resetEntireModule = () => {
    localStorage.removeItem("thinkera_student_profile");
    localStorage.removeItem("thinkera_settings_name");
    localStorage.removeItem("thinkera_settings_email");
    localStorage.removeItem("thinkera_settings_level");
    localStorage.removeItem("thinkera_settings_goal");
    setPageState("success");
    router.refresh();
  };

  // Profile page loading skeleton
  if (initialLoading || pageState === "loading" || !profile) {
    return (
      <div className="flex flex-col gap-8 animate-pulse w-full max-w-7xl mx-auto py-4 select-none">
        {/* Banner shimmer */}
        <div className="bg-white border border-border-main p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-sm min-h-[180px]">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="h-20 w-20 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-3 items-center md:items-start flex-1">
              <div className="h-7 w-48 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-56 bg-slate-200 rounded mt-1" />
            </div>
          </div>
        </div>

        {/* 2-column grid shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Badges card shimmer */}
            <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm h-64">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-xl flex flex-col gap-2 items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="h-4.5 w-16 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity feed shimmer */}
          <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm min-h-[300px]">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="flex flex-col gap-5 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-slate-200" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 w-full max-w-7xl mx-auto select-none relative min-h-[calc(100vh-120px)]">
      
      {/* ========================================================================= */}
      {/* ERROR FALLBACK STATE */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="flex-grow bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[500px]">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-dark">Profile Serialization Interrupted</h3>
          <p className="text-xs text-muted-main max-w-xs leading-relaxed">
            We discovered conflicts rendering your student levels. Flush profile records to reset details.
          </p>
          <button
            onClick={resetEntireModule}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Student Profile</span>
          </button>
        </div>
      )}

      {pageState !== "error" && (
        <>
          {/* 1. Header Profile Banner Overview */}
          <div className="bg-white border border-border-main p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-sm relative overflow-hidden">
            
            {/* Ambient overlay blur background details */}
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full">
              {/* SVG Avatar */}
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-20 w-20 rounded-full border border-slate-200 bg-slate-50 shadow-inner"
              />
              
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <h1 className="text-xl font-black text-dark tracking-tight leading-none">
                    {profile.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-[9px] font-black uppercase tracking-wider">
                    Level {profile.level} Student
                  </span>
                </div>
                
                <p className="text-xs text-muted-main font-semibold flex items-center gap-1.5 justify-center md:justify-start">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>ThinkEra {profile.activePlan} account</span>
                </p>

                <div className="flex items-center gap-4 text-[10px] text-muted-main font-bold mt-2 justify-center md:justify-start border-t border-slate-100 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Member since {joinedDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action settings buttons */}
            <Link
              href="/settings"
              className="px-4 py-2 border border-border-main hover:bg-slate-50 text-muted-main hover:text-dark text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm md:self-start shrink-0 self-center"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Edit Settings</span>
            </Link>

          </div>

          {/* 2. Main Stats & History Timelines grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Stats & Badges grid column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Mini Stats Ring & level widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                
                {/* Solved metrics Ring */}
                <div className="bg-white border border-border-main p-5 rounded-2xl flex items-center gap-6 shadow-sm">
                  <div className="shrink-0 flex items-center justify-center bg-blue-50/50 border border-blue-100 p-3 rounded-2xl">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-main font-bold uppercase tracking-wider">Total Solver Total</span>
                    <span className="text-2xl font-black text-dark tracking-tight leading-none mt-1">
                      {profile.solvedCount} <span className="text-xs text-muted-main font-semibold">Problems</span>
                    </span>
                  </div>
                </div>

                {/* Streak flame consistent counter */}
                <div className="bg-white border border-border-main p-5 rounded-2xl flex items-center gap-6 shadow-sm">
                  <div className="shrink-0 flex items-center justify-center bg-orange-50 border border-orange-100 p-3 rounded-2xl">
                    <Flame className="h-6 w-6 text-orange-600 fill-current animate-bounce" style={{ animationDuration: "3s" }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider">Consistency Streak</span>
                    <span className="text-2xl font-black text-orange-700 tracking-tight leading-none mt-1">
                      {profile.streak} <span className="text-xs text-orange-600 font-semibold">Active Days</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* XP level progression horizontal status bar */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm select-none">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-extrabold text-xs text-dark">Platform Level Progression</h3>
                  </div>
                  <span className="text-[10px] font-bold text-muted-main">
                    {profile.xp} / {nextLevelXp} XP (To Level {profile.level + 1})
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full bg-slate-100 rounded-full border border-slate-200/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                    />
                  </div>
                  <span className="text-[9px] text-muted-main font-semibold self-end">
                    Complete resources or solve DSA problems to secure XP bounds!
                  </span>
                </div>
              </div>

              {/* Badges showcase Grid card */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-extrabold text-xs text-dark tracking-tight">Milestone Badges Showcase</h3>
                </div>

                {profile.badges.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    Zero badges unlocked yet. Keep consistent to earn trophies!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 select-none">
                    {profile.badges.map((badge) => (
                      <motion.div
                        key={badge.id}
                        whileHover={{ scale: 1.03 }}
                        className="p-4 bg-bg-main/30 border border-border-main/50 rounded-xl flex flex-col items-center text-center gap-3 hover:border-slate-300 transition-colors shadow-xs"
                      >
                        <span className="text-3xl filter drop-shadow-sm select-none">{badge.icon}</span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-extrabold text-dark truncate leading-none">{badge.name}</span>
                          <span className="text-[9px] text-muted-main mt-1 leading-relaxed line-clamp-2">
                            {badge.description}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Activity history Timeline Feed column */}
            <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm min-h-[400px]">
              
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 shrink-0">
                <Activity className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-extrabold text-xs text-dark tracking-tight">Recent Activity Timeline</h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mt-2">
                {profile.recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center gap-3 py-12 px-4 h-full my-auto">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-xs text-dark">No Recent Activity logged</span>
                      <p className="text-[9px] text-muted-main leading-relaxed max-w-[180px] mx-auto">
                        Your study logs will appear chronologically as you complete tasks.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-slate-100 ml-3 pl-5 flex flex-col gap-5 select-none text-xs">
                    {profile.recentActivity.map((act) => (
                      <div key={act.activityId} className="relative">
                        
                        {/* Bullet indicators icon based on type */}
                        <div className={`absolute -left-8 top-0.5 h-6.5 w-6.5 rounded-full flex items-center justify-center border bg-white shadow-xs ${
                          act.type === "solved"
                            ? "border-emerald-300 text-emerald-600"
                            : act.type === "focus"
                            ? "border-purple-300 text-purple-600"
                            : "border-blue-300 text-blue-600"
                        }`}>
                          <span className="text-[10px]">
                            {act.type === "solved" ? "💻" : act.type === "focus" ? "🧘" : "📝"}
                          </span>
                        </div>

                        {/* Text card details */}
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="font-extrabold text-slate-800 leading-snug">
                            {act.targetName}
                          </p>
                          
                          <div className="flex items-center gap-2 text-[9px] text-muted-main font-semibold mt-0.5">
                            <span className="uppercase tracking-wider text-[8px] font-black">
                              {act.type}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 font-extrabold">
                              +{act.xpGained} XP
                            </span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* DEV-MODE STATE SANDBOX CONTROLLER */}
          {/* ========================================================================= */}
          <div className="fixed bottom-4 right-4 z-50 glassmorphism p-3 rounded-2xl shadow-lg border border-border-main max-w-xs flex flex-col gap-2 select-none md:flex">
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
                className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all col-span-2 ${
                  pageState === "empty" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                }`}
              >
                Empty Stats / Unstarted View
              </button>
              <button
                onClick={() => setPageState("error")}
                className="px-2 py-1 rounded-md text-[9px] font-bold col-span-2 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200"
              >
                Simulate Profile Error
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
