"use"
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  BookOpen,
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
  Bug
} from "lucide-react";

// Skeletons & Sidebars
import LearnSkeleton from "@/components/LearnSkeleton";
import LearnSidebar from "@/components/LearnSidebar";

// JSON Datasets
import topicsData from "@/mock/topics.json";
import problemsData from "@/mock/problems.json";

interface VideoItem {
  title: string;
  channel: string;
  duration: string;
  url: string;
}

interface BlogItem {
  title: string;
  source: string;
  readTime: string;
  url: string;
}

export default function LearnTopicDashboard() {
  const params = useParams();
  const router = useRouter();
  
  // Dynamic Route Parameter matching
  const topicSlug = params.topicSlug as string;

  // 4 States for Auditing: "success" | "loading" | "empty" | "completed" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "completed" | "error">("success");

  // AI Mentor Chat Drawer active state
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simulated initial async load
  const [initialLoading, setInitialLoading] = useState(true);

  // Interactive Overlays & Watched/Read Tracking
  const [activeModal, setActiveModal] = useState<"videos" | "blogs" | "problems" | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [readBlogs, setReadBlogs] = useState<string[]>([]);

  // Find target topic in mock JSON database
  const originalTopic = topicsData.find(t => t.slug === topicSlug);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [topicSlug]);

  // Handle route not found
  if (!originalTopic && !initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
          <Bug className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-dark">Topic Not Found</h2>
          <p className="text-sm text-muted-main leading-relaxed">
            The learning track slug <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">/learn/{topicSlug}</code> does not exist in our curriculum.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Fallback default state configuration
  const topic = originalTopic || topicsData[0];

  // Robust pairing mechanism for matching problems
  const matchingProblems = problemsData.filter(p => {
    const isLanguageTopic = ["topic-cpp", "topic-java", "topic-python", "topic-js"].includes(topic.id);
    if (isLanguageTopic) {
      return p.category === "Data Structures & Algorithms";
    }
    
    // Web Dev / AI matching
    const pCat = p.category.toLowerCase();
    const tSlug = topic.slug.toLowerCase();
    const tTitle = topic.title.toLowerCase();
    const pSlug = p.slug.toLowerCase();
    
    const matchesSlug = tSlug.includes(pSlug.split("-")[0]) || pSlug.includes(tSlug.split("-")[0]);
    const matchesCategory = pCat.includes(tTitle.split(" ")[0]) || tTitle.includes(pCat.split(" ")[0]);
    
    return matchesSlug || matchesCategory;
  });

  // Dynamic videos list and blogs list from JSON data
  const videosList: VideoItem[] = (topic as any).videos || [
    { title: `Introduction to ${topic.title}`, channel: "ThinkEra", duration: "15 mins", url: "https://www.youtube.com" },
    { title: `Advanced Concepts in ${topic.title}`, channel: "ThinkEra", duration: "25 mins", url: "https://www.youtube.com" }
  ];

  const blogsList: BlogItem[] = (topic as any).blogs || [
    { title: `${topic.title} Core Architecture Guide`, source: "ThinkEra Blog", readTime: "8 mins", url: "https://medium.com" },
    { title: `Common Interview Questions: ${topic.title}`, source: "ThinkEra Blog", readTime: "12 mins", url: "https://medium.com" }
  ];

  // Dynamic state syncing from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVideos = localStorage.getItem(`thinkera_watched_${topic.id}`);
      const savedBlogs = localStorage.getItem(`thinkera_read_${topic.id}`);
      setWatchedVideos(savedVideos ? JSON.parse(savedVideos) : []);
      setReadBlogs(savedBlogs ? JSON.parse(savedBlogs) : []);
    }
  }, [topic.id]);

  const handleWatchVideo = (url: string) => {
    const updated = watchedVideos.includes(url) ? watchedVideos : [...watchedVideos, url];
    setWatchedVideos(updated);
    localStorage.setItem(`thinkera_watched_${topic.id}`, JSON.stringify(updated));
    window.open(url, "_blank");
  };

  const handleReadBlog = (url: string) => {
    const updated = readBlogs.includes(url) ? readBlogs : [...readBlogs, url];
    setReadBlogs(updated);
    localStorage.setItem(`thinkera_read_${topic.id}`, JSON.stringify(updated));
    window.open(url, "_blank");
  };

  // Solve stats check
  const solvedProblemsCount = matchingProblems.filter(p => {
    if (typeof window !== "undefined") {
      return p.userStatus === "solved" || localStorage.getItem(`thinkera_solved_${p.id}`) === "true";
    }
    return p.userStatus === "solved";
  }).length;

  const videoTotal = videosList.length;
  const videoWatched = Math.min(watchedVideos.length, videoTotal);

  const blogsTotal = blogsList.length;
  const blogsRead = Math.min(readBlogs.length, blogsTotal);

  const problemsTotal = matchingProblems.length;
  const problemsSolved = Math.min(solvedProblemsCount, problemsTotal);

  // Compute combined dynamic progress
  const totalElements = videoTotal + blogsTotal + problemsTotal || 1;
  const completedElements = videoWatched + blogsRead + problemsSolved;
  let progress = Math.round((completedElements / totalElements) * 100);

  if (pageState === "empty") {
    progress = 0;
  } else if (pageState === "completed") {
    progress = 100;
  }

  // Pre-load mock messages when AI drawer mounts
  const handleOpenAiDrawer = () => {
    setAiDrawerOpen(true);
    if (chatMessages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages([
          {
            sender: "ai",
            text: `Hello Rudra! I am your AI Mentor. I am fully loaded with structural context about **${topic.title}**.\n\nAsk me any algorithmic question, such as "Explain how to calculate dynamic segments" or click a topic prompt below!`
          }
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  // Chat message submission (optimistic streamed typewriter mock)
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // AI streaming feedback simulation
    setTimeout(() => {
      let aiResponse = "";
      if (text.toLowerCase().includes("segment") || text.toLowerCase().includes("router")) {
        aiResponse = "To calculate dynamic segment resolutions in Next.js, we splits route templates by slashes and extract parts enclosed in brackets `[param]`. We then map them to request URL components. Check out **Problem 1** inside your recommended problem list to write a dynamic router resolver yourself!";
      } else if (text.toLowerCase().includes("spring") || text.toLowerCase().includes("framer")) {
        aiResponse = "Framer Motion springs use physical parameters instead of durations. `stiffness` sets physical pushback strength while `damping` regulates bounces. For standard UI, use `stiffness: 300` and `damping: 20` for a snappy bounce.";
      } else {
        aiResponse = `Mastering **${topic.title}** requires progressive computational thinking. Try starting with video content, checking out curated articles, and then attempting Easy difficulty challenges in the Problems grid!`;
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } as const },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } as const }
  };

  if (initialLoading || pageState === "loading") {
    return <LearnSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 w-full max-w-7xl mx-auto relative">
      
      {/* 1. Contextual Collapsible Left Sidebar */}
      <LearnSidebar currentSlug={topic.slug} />

      {/* 2. Main Content Dashboard Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageState}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 flex flex-col gap-6"
        >
          
          {/* ========================================================================= */}
          {/* ERROR FALLBACK STATE */}
          {/* ========================================================================= */}
          {pageState === "error" && (
            <div className="bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm h-[400px]">
              <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-dark">Content Syncing Blocked</h3>
              <p className="text-xs text-muted-main max-w-xs leading-relaxed">
                Could not pull video playlist metadata or coding statistics from the database. Please try reloading the topic.
              </p>
              <button
                onClick={() => {
                  setPageState("loading");
                  setTimeout(() => setPageState("success"), 600);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reload Track</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DYNAMIC TOPIC CONTAINER (SUCCESS / COMPLETED / EMPTY) */}
          {/* ========================================================================= */}
          {pageState !== "error" && (
            <>
              {/* Topic Syllabus Header */}
              <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[150px] -z-10" />
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md uppercase tracking-wider">
                      {topic.category}
                    </span>
                    <span className="text-xs text-muted-main">• {topic.estimatedTime} syllabus</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight leading-tight mt-1">
                    {topic.title}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-muted-main leading-relaxed max-w-3xl">
                  {topic.description}
                </p>

                {/* Overall horizontal progress indicator */}
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-main leading-none">
                    <span>Topic Progress</span>
                    <span className="text-dark font-extrabold">{progress}% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-600 rounded-full"
                      transition={{ type: "spring", stiffness: 85 }}
                    />
                  </div>
                </div>

                {/* Completed Topic Celebration Banner */}
                {progress === 100 && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl mt-2 flex items-center justify-between gap-4 flex-col sm:flex-row"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold">Congratulations! Topic Fully Mastered! 🏆</span>
                        <p className="text-[11px] leading-relaxed text-emerald-700 mt-1">
                          You have checked off all video lectures, read all curated analysis articles, and solved all associated coding challenges.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Unlocking Next Curriculum Node")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 shrink-0 self-stretch sm:self-auto justify-center"
                    >
                      <span>Unlock Next Topic</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* 2x2 Resource Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Videos Playlist Card */}
                <div className="bg-white border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-52">
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                      <Video className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-dark mt-2 tracking-tight">Structured Video Lectures</h3>
                    <p className="text-[11px] text-muted-main leading-relaxed">
                      Curated video tracks covering conceptual analysis and live walkthroughs of target algorithms.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                    <span className="text-xs font-bold text-dark">{videoWatched} / {videoTotal} watched</span>
                    <button
                      onClick={() => setActiveModal("videos")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>

                {/* 2. Analytical Blogs Card */}
                <div className="bg-white border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-52">
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-dark mt-2 tracking-tight">Curated Reading Articles</h3>
                    <p className="text-[11px] text-muted-main leading-relaxed">
                      Deeply analytical blogs detailing time-complexities, edge-cases, and comparative algorithms.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                    <span className="text-xs font-bold text-dark">{blogsRead} / {blogsTotal} read</span>
                    <button
                      onClick={() => setActiveModal("blogs")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Problems Hub Card */}
                <div className="bg-white border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-52">
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                      <Code className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-dark mt-2 tracking-tight">Topic-Wise Coding Practice</h3>
                    <p className="text-[11px] text-muted-main leading-relaxed">
                      Hands-on playground exercises mapped to the core concepts to test implementation speeds.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                    <span className="text-xs font-bold text-dark">{problemsSolved} / {problemsTotal} solved</span>
                    <button
                      onClick={() => setActiveModal("problems")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>Solve</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 4. Contextual AI Mentor Card */}
                <div className="bg-white border border-border-main p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-52 cursor-pointer group"
                  onClick={handleOpenAiDrawer}
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-sm text-dark mt-2 tracking-tight group-hover:text-primary transition-colors">
                      Query AI Mentor
                    </h3>
                    <p className="text-[11px] text-muted-main leading-relaxed">
                      Consult our streaming conversational guide to clarify concepts, complex indices, or edge-case constraints.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                    <span className="text-xs font-bold text-orange-600">Context active</span>
                    <button
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

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
                In-Progress View
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
                Not Started View
              </button>
              <button
                onClick={() => setPageState("completed")}
                className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                  pageState === "completed" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                }`}
              >
                Completed View
              </button>
              <button
                onClick={() => setPageState("error")}
                className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all col-span-2 ${
                  pageState === "error" ? "bg-primary text-white" : "bg-slate-100 hover:bg-slate-200 text-dark"
                }`}
              >
                Error View
              </button>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. AI MENTOR SLIDING DRAWER (RIGHT PANEL) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {aiDrawerOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white border-l border-border-main z-50 shadow-2xl flex flex-col justify-between"
            >
              
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-border-main flex items-center justify-between bg-bg-main/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-sm text-dark">AI Mentor</span>
                    <span className="text-[10px] text-muted-main font-semibold mt-1">Topic: {topic.title}</span>
                  </div>
                </div>
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-muted-main hover:text-dark transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Viewport Area */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-bg-main/10 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed font-medium ${
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
                  <div className="self-start bg-white border border-border-main px-4 py-3 rounded-2xl rounded-bl-none shadow-xs flex items-center gap-1 max-w-[85%]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              {/* Preset Smart Q&A Prompts */}
              <div className="px-5 py-2.5 border-t border-border-main bg-white/95 flex flex-wrap gap-1.5 select-none">
                <button
                  onClick={() => sendMessage(`Tell me the core complexity of ${topic.title}.`)}
                  className="px-2.5 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 text-[10px] font-bold text-primary transition-colors text-left"
                >
                  Complexity?
                </button>
                <button
                  onClick={() => sendMessage(`What are common placement interview edge cases in ${topic.title}?`)}
                  className="px-2.5 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 text-[10px] font-bold text-primary transition-colors text-left"
                >
                  Interview Edge Cases?
                </button>
              </div>

              {/* Chat Input composer */}
              <div className="px-5 py-4 border-t border-border-main bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(inputValue)}
                  placeholder="Ask your AI Mentor a concept..."
                  className="flex-1 px-4 py-2.5 border border-border-main rounded-xl text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-bg-main/30"
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  className="h-9 w-9 rounded-xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white shadow-sm transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. CURATED RESOURCES MODAL OVERLAYS (VIDEOS, BLOGS, PROBLEMS) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] cursor-pointer"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white border border-border-main z-[110] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    activeModal === "videos" ? "bg-red-50 text-red-600 border border-red-100" :
                    activeModal === "blogs" ? "bg-blue-50 text-primary border border-blue-100" :
                    "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}>
                    {activeModal === "videos" && <Video className="h-5 w-5" />}
                    {activeModal === "blogs" && <BookOpen className="h-5 w-5" />}
                    {activeModal === "problems" && <Code className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-sm text-dark tracking-tight leading-none">
                      {activeModal === "videos" && "Structured Video Lectures"}
                      {activeModal === "blogs" && "Curated Reading Articles"}
                      {activeModal === "problems" && "Topic-Wise Coding Practice"}
                    </h3>
                    <span className="text-[10px] text-muted-main font-semibold mt-1">
                      Track: {topic.title}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-muted-main hover:text-dark transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body Contents */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 scrollbar-thin flex flex-col gap-4">
                
                {/* VIDEOS LISTING */}
                {activeModal === "videos" && (
                  <div className="flex flex-col gap-3.5">
                    {videosList.map((video: VideoItem, idx: number) => {
                      const isWatched = watchedVideos.includes(video.url);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleWatchVideo(video.url)}
                          className={`p-4 border rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 select-none ${
                            isWatched
                              ? "bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/30"
                              : "bg-white border-border-main hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Video index or status checkmark */}
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isWatched
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-muted-main"
                            }`}>
                              {isWatched ? <CheckCircle className="h-4.5 w-4.5" /> : idx + 1}
                            </div>
                            <div className="flex flex-col leading-snug">
                              <span className="font-bold text-dark text-xs sm:text-sm hover:underline hover:text-primary">
                                {video.title}
                              </span>
                              <span className="text-[10px] text-muted-main font-semibold mt-1">
                                {video.channel} • {video.duration}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xs flex items-center gap-1 shrink-0 ${
                              isWatched
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-slate-900 text-white hover:bg-black"
                            }`}
                          >
                            <Play className="h-2.5 w-2.5 fill-current" />
                            <span>{isWatched ? "Watched Again" : "Watch Lecture"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* BLOGS LISTING */}
                {activeModal === "blogs" && (
                  <div className="flex flex-col gap-3.5">
                    {blogsList.map((blog: BlogItem, idx: number) => {
                      const isRead = readBlogs.includes(blog.url);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleReadBlog(blog.url)}
                          className={`p-4 border rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 select-none ${
                            isRead
                              ? "bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/30"
                              : "bg-white border-border-main hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Blog status icon */}
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isRead
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-muted-main"
                            }`}>
                              {isRead ? <CheckCircle className="h-4.5 w-4.5" /> : idx + 1}
                            </div>
                            <div className="flex flex-col leading-snug">
                              <span className="font-bold text-dark text-xs sm:text-sm hover:underline hover:text-primary">
                                {blog.title}
                              </span>
                              <span className="text-[10px] text-muted-main font-semibold mt-1">
                                Source: {blog.source} • {blog.readTime} read
                              </span>
                            </div>
                          </div>

                          <button
                            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xs flex items-center gap-1 shrink-0 ${
                              isRead
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-slate-900 text-white hover:bg-black"
                            }`}
                          >
                            <span>{isRead ? "Read Again" : "Read Article"}</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PROBLEMS LISTING */}
                {activeModal === "problems" && (
                  <div className="flex flex-col gap-3.5">
                    {matchingProblems.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-muted-main select-none">
                        <Bug className="h-8 w-8 text-slate-300" />
                        <span className="text-xs font-semibold">No exercises mapped for this syllabus yet. Check back soon!</span>
                      </div>
                    ) : (
                      matchingProblems.map((prob: any) => {
                        const isSolved = prob.userStatus === "solved" || (typeof window !== "undefined" && localStorage.getItem(`thinkera_solved_${prob.id}`) === "true");
                        return (
                          <div
                            key={prob.id}
                            className={`p-4 border rounded-xl flex items-center justify-between gap-4 ${
                              isSolved
                                ? "bg-emerald-50/20 border-emerald-100"
                                : "bg-white border-border-main"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Status indicator */}
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSolved ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-muted-main"
                              }`}>
                                <Code className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col leading-snug">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-dark text-xs sm:text-sm">
                                    {prob.title}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                                    prob.difficulty === "Easy" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                                    prob.difficulty === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                                    "bg-red-50 text-red-800 border border-red-100"
                                  }`}>
                                    {prob.difficulty}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-main font-semibold mt-1">
                                  {prob.category} • {prob.points} XP • {prob.solvedCount} solves
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/problems/${prob.slug}`}
                              onClick={() => setActiveModal(null)}
                              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold shadow-xs flex items-center gap-1 shrink-0 ${
                                isSolved
                                  ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                                  : "bg-primary hover:bg-primary-hover text-white"
                              }`}
                            >
                              <span>{isSolved ? "Practice Again" : "Solve Challenge"}</span>
                              <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
