"use"
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Compass,
  Code,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Terminal,
  Activity,
  Award
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      } as const,
    },
  };

  const features = [
    {
      title: "Structured Learning Track",
      desc: "Curated high-quality video tutorials and deeply analytical blogs. No more wasting time searching YouTube.",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-500/5",
      borderLight: "group-hover:border-blue-500/30",
    },
    {
      title: "Interactive Visual Roadmaps",
      desc: "Map your journey from absolute DSA beginner to placement-ready with a reactive, node-based flowchart.",
      icon: Compass,
      color: "from-teal-400 to-emerald-600",
      bgLight: "bg-emerald-500/5",
      borderLight: "group-hover:border-emerald-500/30",
    },
    {
      title: "Premium 3-Panel Playground",
      desc: "An immersive coding environment powered by Monaco Editor. Resizable panels for instructions, code, and test cases.",
      icon: Code,
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-500/5",
      borderLight: "group-hover:border-purple-500/30",
    },
    {
      title: "Contextual AI Mentor",
      desc: "Instant, conversational hints structured using Gemini API. Guides your solution step-by-step without giving away code.",
      icon: Sparkles,
      color: "from-amber-400 to-orange-600",
      bgLight: "bg-orange-500/5",
      borderLight: "group-hover:border-orange-500/30",
    },
    {
      title: "Accountability Community",
      desc: "Solve doubts instantly with peers, earn reputation badges, share study materials, and celebrate streak milestones.",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-500/5",
      borderLight: "group-hover:border-cyan-500/30",
    },
    {
      title: "Minimalist Focus Mode",
      desc: "A Pomodoro-driven focus timer that locks out distractions. Log sessions, build streaks, and maintain deep focus.",
      icon: Clock,
      color: "from-rose-500 to-red-600",
      bgLight: "bg-rose-500/5",
      borderLight: "group-hover:border-rose-500/30",
    },
  ];

  const stats = [
    { value: "14K+", label: "Active Learners", sub: "BTech, BCA & MCA aspirants" },
    { value: "500+", label: "Curated Problems", sub: "Topic-wise placement sets" },
    { value: "94.2%", label: "Placement Rate", sub: "Students at Top-tier companies" },
    { value: "120K+", label: "AI Chats Served", sub: "Contextual smart assistance" },
  ];

  return (
    <div className="flex flex-col gap-24 py-4 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-8 justify-between">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[350px] h-[350px] rounded-full bg-cyan-400/5 blur-[100px] -z-10" />

        {/* Hero Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="flex-1 max-w-2xl flex flex-col gap-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary font-semibold text-xs self-center lg:self-start">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Guided Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark leading-tight tracking-tight">
            Elevate Your DSA Game.<br />
            Secure Your <span className="gradient-text">Dream Placement.</span>
          </h1>

          <p className="text-lg text-muted-main leading-relaxed">
            Consolidating video lectures, interactive roadmaps, curated coding problems, peer accountability, and an AI Mentor into one fluid, beautiful web workspace. Built specifically for Indian tech students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <Link
              href="/roadmap"
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary-hover transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Explore Roadmaps</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/problems"
              className="px-8 py-4 bg-white text-dark border border-border-main rounded-xl font-bold shadow-sm hover:shadow-md hover:border-dark transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Code className="h-5 w-5 text-primary" />
              <span>Start Coding</span>
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 mt-6 border-t border-border-main pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-text-main">No Credit Card Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-text-main">Always Free Mock Mode</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Right Mockup Graphics */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="flex-1 w-full max-w-xl relative"
        >
          {/* Glassmorphic Mockup of problem solver */}
          <div className="w-full aspect-[4/3] rounded-2xl glassmorphism shadow-lg overflow-hidden border border-border-main/80 flex flex-col">
            <div className="bg-white/80 px-4 py-3 border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-xs bg-bg-main px-3 py-1 rounded-md border border-border-main text-muted-main select-none flex items-center gap-1">
                <Terminal className="h-3 w-3 text-primary" />
                <span>problems/two-sum.ts</span>
              </div>
              <div className="h-4 w-4" />
            </div>

            {/* Simulated 3-Panel Split view */}
            <div className="flex-1 grid grid-cols-5 bg-white/40">
              {/* Instructions Panel */}
              <div className="col-span-2 border-r border-border-main p-4 flex flex-col gap-3 overflow-hidden select-none">
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase">01. Instructions</span>
                <h3 className="font-bold text-sm text-dark mt-[-4px]">Two Sum</h3>
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold self-start">
                  Easy
                </div>
                <p className="text-[11px] text-text-main leading-relaxed">
                  Given an array of integers <code className="bg-bg-main p-0.5 rounded text-red-600 font-mono text-[10px]">nums</code> and an integer target, return indices of...
                </p>
                <div className="mt-2 bg-bg-main/60 p-2 rounded-lg border border-border-main/50 font-mono text-[10px] text-muted-main leading-relaxed">
                  <strong>Input:</strong> nums = [2,7,11], target = 9<br />
                  <strong>Output:</strong> [0,1]
                </div>
              </div>

              {/* Code Panel */}
              <div className="col-span-3 p-4 flex flex-col gap-2 font-mono text-xs overflow-hidden select-none bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
                  <span>TypeScript</span>
                  <span className="text-emerald-400">● Running</span>
                </div>
                <p className="text-purple-400"><span className="text-blue-400">function</span> <span className="text-amber-400">twoSum</span>(nums, target) &#123;</p>
                <p className="pl-4 text-slate-400">// Storing indexes in map</p>
                <p className="pl-4"><span className="text-blue-400">const</span> map = <span className="text-blue-400">new</span> <span className="text-emerald-400">Map</span>();</p>
                <p className="pl-4"><span className="text-pink-400">for</span> (<span className="text-blue-400">let</span> i = 0; i &lt; nums.length; i++) &#125;</p>
                <p className="pl-8 text-slate-400">...</p>
                <p className="pl-4">&#125;</p>
                
                {/* Simulated Floating AI hint */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-auto bg-primary/95 text-white p-3 rounded-xl shadow-md flex items-start gap-2.5 backdrop-blur font-sans"
                >
                  <Sparkles className="h-4.5 w-4.5 text-amber-300 flex-shrink-0 animate-bounce" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-amber-200">AI Mentor Hint</span>
                    <p className="text-[10px] leading-relaxed text-slate-50">
                      Instead of a nested loop, try calculating the complement: <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-[9px]">target - nums[i]</code>.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Interactive Floating Badge Widgets */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-12 left-[-30px] bg-white border border-border-main p-3 rounded-xl shadow-md flex items-center gap-3 hidden md:flex"
          >
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
              <span>🔥</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-main">Active Streak</span>
              <span className="text-xs font-extrabold text-dark">14 Days Saved</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-8 right-[-20px] bg-white border border-border-main p-3 rounded-xl shadow-md flex items-center gap-3 hidden md:flex"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Award className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-main">Modules Complete</span>
              <span className="text-xs font-extrabold text-dark">65% of Next.js path</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-white border border-border-main rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10" />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm font-bold text-dark">{stat.label}</span>
              <span className="text-xs text-muted-main">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section (6 Feature Cards) */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Everything You Need</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight">
            Designed for Campus Placements. Powered by Modern UX.
          </h2>
          <p className="text-sm sm:text-base text-muted-main leading-relaxed">
            Consolidating scattered platforms into a single, cohesive, premium interface designed to foster consistent, progressive habit-building.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group p-6 bg-white border border-border-main rounded-2xl hover:border-transparent hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="flex flex-col gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feat.bgLight} border border-border-main transition-colors duration-300`}>
                    <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-main leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Interactive Experience Preview */}
      <section className="flex flex-col lg:flex-row items-center gap-12 justify-between">
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Take Control</span>
          <h2 className="text-3xl font-bold text-dark leading-tight">
            Stop Stalling on Buggy Code.<br />
            Let AI Guide Your Concept.
          </h2>
          <p className="text-sm sm:text-base text-muted-main leading-relaxed">
            With our integrated AI Mentor powered by Gemini, you don't get spoon-fed code. You receive highly contextual, structured code hints designed to force computational thinking.
          </p>

          <div className="space-y-4">
            {[
              "Real-time, debounced problem filtering and status trackers",
              "Streaming conversational feedback mimicking professional code interviews",
              "Direct connection to peer doubts and editorial answers",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <CheckCircle className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-text-main font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md font-mono text-xs text-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-3 mb-4">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Console</span>
            </span>
            <span>index.ts</span>
          </div>

          <p className="text-blue-400">// Test case execution result</p>
          <p className="text-slate-400 mt-2 font-bold select-none">&gt; node test_runner.js</p>
          <div className="space-y-1.5 mt-3 pl-3 border-l-2 border-slate-800">
            <p className="text-emerald-400 flex items-center gap-2">
              <span>✔</span>
              <span>Test Case 1 passed (input: [2, 7, 11], target: 9) - 1.2ms</span>
            </p>
            <p className="text-emerald-400 flex items-center gap-2">
              <span>✔</span>
              <span>Test Case 2 passed (input: [3, 2, 4], target: 6) - 0.9ms</span>
            </p>
            <p className="text-rose-400 flex items-center gap-2">
              <span>✘</span>
              <span>Test Case 3 failed (input: [3, 3], target: 6) - expected: [0,1], actual: null</span>
            </p>
          </div>

          <div className="mt-6 p-3 bg-slate-800/50 border border-slate-800 rounded-xl flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 text-xs flex-shrink-0 animate-bounce">
              💡
            </div>
            <div className="flex flex-col gap-1 font-sans">
              <span className="text-[10px] font-bold text-orange-300">Code Optimization Tip</span>
              <p className="text-[10px] text-slate-300 leading-normal">
                Check edge cases! Ensure you don't return the same element index twice if dynamic duplicates exist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Testimonial Grid Section */}
      <section className="bg-bg-main border border-border-main/50 rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Success Stories</span>
          <h2 className="text-3xl font-bold text-dark leading-tight">
            Hear it from Our Alumni
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Anoop"
                alt="Anoop"
                className="h-10 w-10 rounded-full border border-border-main"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-dark">Anoop Sharma</span>
                <span className="text-xs text-muted-main">MCA 2025, Placed at Amazon</span>
              </div>
              <div className="ml-auto flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-text-main leading-relaxed italic">
              "ThinkEra completely changed my DSA routine. Having the Pomodoro Focus timer directly alongside my Monaco compiler meant I stopped alt-tabbing to distractions. I completed 120 array and graph problems in 4 weeks and cracked the Amazon off-campus test!"
            </p>
          </div>

          <div className="p-6 bg-white border border-border-main rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Nisha"
                alt="Nisha"
                className="h-10 w-10 rounded-full border border-border-main"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-dark">Nisha Krishnan</span>
                <span className="text-xs text-muted-main">BTech CSE 2026, Placed at Oracle</span>
              </div>
              <div className="ml-auto flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-text-main leading-relaxed italic">
              "The interactive roadmap in ThinkEra was my single source of truth. I loved how the nodes changed from blue (pulse) to green (check) as I progressed. The Gemini AI Mentor hint system is fantastic — it simulates real interview queries without giving away direct code."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-dark text-white rounded-2xl p-8 sm:p-16 shadow-lg text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[350px] h-[350px] rounded-full bg-primary/25 blur-[120px] -z-10" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[350px] h-[350px] rounded-full bg-blue-400/10 blur-[100px] -z-10" />

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl text-white">
          Ready to Crack Your Technical Placements?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
          Create your personalized visual roadmap, challenge yourself with structured coding practice, and utilize interactive AI hints to build core algorithmic intuition.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link
            href="/roadmap"
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/problems"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/20 hover:border-white transition-all flex items-center justify-center gap-2"
          >
            <Code className="h-5 w-5 text-primary" />
            <span>Try Coding Playground</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
