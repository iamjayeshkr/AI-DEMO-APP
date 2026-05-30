"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Compass, Code, Terminal, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, loading } = useAuth();
  const [authChecking, setAuthChecking] = useState(true);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        setAuthChecking(false);
      }
    }
  }, [user, loading, router]);

  if (loading || authChecking) {
    return (
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-extrabold text-muted-main select-none">Checking authentication state...</span>
      </div>
    );
  }

  const features = [
    {
      title: "Interactive roadmaps",
      desc: "Curated learning roadmaps for BCA, MCA, and BTech students.",
      icon: Compass,
      color: "bg-blue-50 text-blue-600 border border-blue-100"
    },
    {
      title: "WASM Code Compiler",
      desc: "Solve DSA challenges directly inside a Monaco-backed editor.",
      icon: Code,
      color: "bg-emerald-50 text-emerald-600 border border-emerald-100"
    },
    {
      title: "Conversational AI Mentor",
      desc: "Clarify indices, edge cases, and time complexity in real-time.",
      icon: Sparkles,
      color: "bg-orange-50 text-orange-600 border border-orange-100"
    }
  ];

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-6 select-none relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] -z-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 sm:px-6">
        
        {/* Left column: Branding details and features list */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full uppercase tracking-wider self-start select-none">
              🚀 MASTER PLACEMENTS & DSA
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-dark tracking-tight leading-tight mt-2">
              Supercharge Your Algorithmic Thinking with <span className="text-primary">ThinkEra</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-main leading-relaxed mt-2 max-w-xl">
              Consolidating video courses, curated coding challenges, visual roadmaps, and an interactive AI Mentor into one cohesive, stunning tech workspace.
            </p>
          </div>

          {/* Features check grid */}
          <div className="flex flex-col gap-4 mt-2">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white border border-border-main rounded-2xl shadow-xs"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${feat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col leading-snug">
                    <span className="font-extrabold text-xs sm:text-sm text-dark">{feat.title}</span>
                    <p className="text-[10px] sm:text-xs text-muted-main mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column: Glassmorphic Google login card */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white border border-border-main p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col items-center gap-6"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10" />

            {/* Logo box */}
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md animate-pulse">
              <Terminal className="h-7 w-7" />
            </div>

            <div className="text-center flex flex-col gap-1.5">
              <h2 className="text-xl font-black text-dark tracking-tight leading-none">Welcome to ThinkEra</h2>
              <p className="text-[11px] text-muted-main leading-relaxed mt-1">
                Master DSA and ace technical interviews. Create a session to secure your coding streaks.
              </p>
            </div>

            {/* Google Authorization trigger button */}
            <button
              onClick={signInWithGoogle}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white hover:shadow-md font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2.5 border border-slate-800"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Platform statistics footer */}
            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-center select-none">
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-dark">500+</span>
                <span className="text-[9px] text-muted-main mt-1 font-semibold uppercase tracking-wider">Placement Solves</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-dark">14 Days</span>
                <span className="text-[9px] text-muted-main mt-1 font-semibold uppercase tracking-wider">Avg. Streak</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
