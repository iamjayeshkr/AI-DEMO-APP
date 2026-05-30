"use"
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Play,
  ArrowLeft,
  X,
  Sparkles,
  BookOpen,
  Code,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Bug
} from "lucide-react";

// Skeletons & Widgets
import RoadmapSkeleton from "@/components/RoadmapSkeleton";
import ProgressRing from "@/components/ProgressRing";

// JSON Curriculum
import topicsData from "@/mock/topics.json";
import problemsData from "@/mock/problems.json";

export default function VisualRoadmap() {
  const params = useParams();
  const router = useRouter();

  // dynamic URL track param: "dsa" | "placement"
  const track = params.track as string;

  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");

  // Simulated initial async load
  const [initialLoading, setInitialLoading] = useState(true);

  // Pan & Zoom States
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Node Hover Tooltip States
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Mobile Bottom Drawer States
  const [drawerNode, setDrawerNode] = useState<any | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, [track]);

  // Handle route not found
  if (track !== "dsa" && track !== "placement" && !initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6">
        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
          <Bug className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-dark">Roadmap Not Found</h2>
          <p className="text-sm text-muted-main leading-relaxed">
            The curriculum track <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">/roadmap/{track}</code> does not exist.
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

  // Pre-load coordinates mapping for curriculum nodes (hand-crafted grid for premium aesthetics)
  const isDsa = track === "dsa";

  // Helper to dynamically calculate problem counts per topic slug and id
  const getProblemCountForTopic = (topicId: string, topicSlug: string) => {
    const isLang = ["topic-cpp", "topic-java", "topic-python", "topic-js"].includes(topicId);
    if (isLang) {
      return problemsData.filter(p => p.category === "Data Structures & Algorithms").length;
    }
    // Web Dev / AI matching
    return problemsData.filter(p => {
      const pCat = p.category.toLowerCase();
      const tSlug = topicSlug.toLowerCase();
      const pSlug = p.slug.toLowerCase();
      const matchesSlug = tSlug.includes(pSlug.split("-")[0]) || pSlug.includes(tSlug.split("-")[0]);
      return matchesSlug || pCat.includes(tSlug.split("-")[0]);
    }).length;
  };

  const baseNodes = isDsa ? [
    {
      ...topicsData[4], // C++ (index 4)
      x: 120,
      y: 100,
      phase: "Phase 1: Core Languages",
      videoCount: topicsData[4]?.videos?.length || 20,
      blogCount: topicsData[4]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[4].id, topicsData[4].slug)
    },
    {
      ...topicsData[6], // Python (index 6)
      x: 360,
      y: 100,
      phase: "Phase 1: Core Languages",
      videoCount: topicsData[6]?.videos?.length || 20,
      blogCount: topicsData[6]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[6].id, topicsData[6].slug)
    },
    {
      ...topicsData[5], // Java (index 5)
      x: 120,
      y: 280,
      phase: "Phase 2: DSA & Advanced",
      videoCount: topicsData[5]?.videos?.length || 20,
      blogCount: topicsData[5]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[5].id, topicsData[5].slug)
    },
    {
      ...topicsData[7], // JavaScript (index 7)
      x: 360,
      y: 280,
      phase: "Phase 2: DSA & Advanced",
      videoCount: topicsData[7]?.videos?.length || 20,
      blogCount: topicsData[7]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[7].id, topicsData[7].slug)
    }
  ] : [
    {
      ...topicsData[0], // Next.js 14 (index 0)
      x: 120,
      y: 100,
      phase: "Phase 1: Foundations",
      videoCount: topicsData[0]?.videos?.length || 20,
      blogCount: topicsData[0]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[0].id, topicsData[0].slug)
    },
    {
      ...topicsData[1], // Framer Motion (index 1)
      x: 360,
      y: 100,
      phase: "Phase 1: Foundations",
      videoCount: topicsData[1]?.videos?.length || 20,
      blogCount: topicsData[1]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[1].id, topicsData[1].slug)
    },
    {
      ...topicsData[2], // PostgreSQL (index 2)
      x: 120,
      y: 280,
      phase: "Phase 2: Advanced Engineering",
      videoCount: topicsData[2]?.videos?.length || 20,
      blogCount: topicsData[2]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[2].id, topicsData[2].slug)
    },
    {
      ...topicsData[3], // Gemini API (index 3)
      x: 360,
      y: 280,
      phase: "Phase 2: Advanced Engineering",
      videoCount: topicsData[3]?.videos?.length || 20,
      blogCount: topicsData[3]?.blogs?.length || 10,
      problemCount: getProblemCountForTopic(topicsData[3].id, topicsData[3].slug)
    }
  ];

  // Adjust node progress states based on audited pageState
  const nodes = baseNodes.map((n) => {
    let progress = n.progress;
    if (pageState === "empty") {
      progress = 0;
    } else {
      // Give a highly realistic premium pre-seeded progress layout
      if (n.id === "topic-cpp") progress = 100;
      else if (n.id === "topic-python") progress = 35;
      else if (n.id === "topic-nextjs") progress = 65;
      else if (n.id === "topic-react-motion") progress = 20;
      else progress = 0;
    }
    return { ...n, progress };
  });

  // Calculate global completed ratio
  const completedCount = nodes.filter(n => n.progress === 100).length;
  const totalCount = nodes.length;
  const globalProgress = Math.round((completedCount / totalCount) * 100);

  // Pan canvas handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Exclude button/node clicking
    const target = e.target as HTMLElement;
    if (target.closest(".roadmap-node") || target.closest(".canvas-button")) return;
    
    setIsPanning(true);
    startPan.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.current.x,
      y: e.clientY - startPan.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom helpers
  const handleZoom = (factor: number) => {
    setZoom(prev => Math.min(1.5, Math.max(0.6, prev * factor)));
  };

  const resetCanvas = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Hover Tooltip positions calculations
  const handleNodeMouseEnter = (e: React.MouseEvent, node: any) => {
    if (window.innerWidth < 768) return; // Skip tooltips on mobile
    const rect = e.currentTarget.getBoundingClientRect();
    const container = canvasRef.current?.getBoundingClientRect();
    
    if (container) {
      setHoveredNode(node);
      setTooltipPos({
        x: rect.left - container.left + rect.width / 2,
        y: rect.top - container.top - 10
      });
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } as const },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } as const }
  };

  if (initialLoading || pageState === "loading") {
    return <RoadmapSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 w-full h-[calc(100vh-120px)] max-w-7xl mx-auto select-none relative">
      
      {/* ========================================================================= */}
      {/* ERROR FALLBACK STATE */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="flex-1 bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm h-full">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-dark">Roadmap Initialization Failed</h3>
          <p className="text-xs text-muted-main max-w-xs leading-relaxed">
            We couldn't parse the curriculum arrow connector maps or topic lock prerequisites from the database.
          </p>
          <button
            onClick={() => {
              setPageState("loading");
              setTimeout(() => setPageState("success"), 600);
            }}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reload Map Canvas</span>
          </button>
        </div>
      )}

      {pageState !== "error" && (
        <>
          {/* 1. Contextual Left Sidebar Progress Panel */}
          <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: "10s" }} />
              <h3 className="font-bold text-sm text-dark tracking-tight">Curriculum Tracking</h3>
            </div>

            {/* Overall progress SVG ring */}
            <div className="flex flex-col items-center justify-center py-2 border-b border-slate-50 pb-4">
              <ProgressRing percentage={globalProgress} size={125} strokeWidth={9} />
              <p className="text-xs text-muted-main text-center leading-relaxed max-w-[200px] mt-4">
                Completed <span className="font-extrabold text-dark">{completedCount} out of {totalCount}</span> modular track targets.
              </p>
            </div>

            {/* Curriculum Track Switcher */}
            <div className="flex flex-col gap-2 select-none">
              <span className="text-[10px] font-bold text-muted-main uppercase tracking-wider">Curriculum Path:</span>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl w-full">
                <Link
                  href="/roadmap/dsa"
                  className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-center transition-all ${
                    track === "dsa" ? "bg-white text-dark shadow-xs border border-border-main/50" : "text-muted-main hover:text-dark"
                  }`}
                >
                  Core DSA Track
                </Link>
                <Link
                  href="/roadmap/placement"
                  className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-center transition-all ${
                    track === "placement" ? "bg-white text-dark shadow-xs border border-border-main/50" : "text-muted-main hover:text-dark"
                  }`}
                >
                  Placement Set
                </Link>
              </div>
            </div>
          </div>

          {/* 2. SVG Node Graph Canvas (resizable) */}
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-grow bg-white border border-border-main rounded-2xl shadow-sm h-full relative overflow-hidden flex flex-col p-6 gap-6 cursor-grab ${
              isPanning ? "cursor-grabbing" : ""
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0 select-none">
              <div className="flex flex-col gap-0.5">
                <h1 className="text-base font-extrabold text-dark tracking-tight leading-none">
                  {track === "dsa" ? "Core Data Structures & Algorithms Syllabus" : "Placement Prep Curriculum Set"}
                </h1>
                <span className="text-[10px] text-muted-main font-semibold mt-1">
                  Click nodes to study. Drag canvas to pan, scroll to zoom.
                </span>
              </div>
            </div>

            {/* Canvas view viewport */}
            <div className="flex-1 bg-slate-50/30 rounded-xl relative border border-slate-100/50 overflow-hidden min-h-0">
              
              {/* Radial dots grid grid-dots background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none select-none" />

              {/* Node content split frame */}
              <div
                className="absolute inset-0 origin-center transition-transform duration-75"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
                }}
              >
                
                {/* SVG Prerequisite Connection Arrows */}
                <svg className="absolute inset-0 w-[800px] h-[600px] pointer-events-none overflow-visible">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#CBD5E1" />
                    </marker>
                    <marker
                      id="arrow-active"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
                    </marker>
                  </defs>

                  {/* Arrow 1: Next.js -> Framer Motion (Phase 1 connector) */}
                  <path
                    d={`M 180 100 L 300 100`}
                    fill="transparent"
                    stroke={nodes[1].progress > 0 ? "#2563EB" : "#CBD5E1"}
                    strokeWidth={nodes[1].progress > 0 ? 3 : 2}
                    markerEnd={`url(#${nodes[1].progress > 0 ? "arrow-active" : "arrow"})`}
                  />

                  {/* Arrow 2: Next.js -> PostgreSQL (prereq pathway) */}
                  <path
                    d={`M 120 120 Q 80 190 120 260`}
                    fill="transparent"
                    stroke={nodes[2].progress > 0 ? "#2563EB" : "#CBD5E1"}
                    strokeWidth={nodes[2].progress > 0 ? 3 : 2}
                    markerEnd={`url(#${nodes[2].progress > 0 ? "arrow-active" : "arrow"})`}
                  />

                  {/* Arrow 3: PostgreSQL -> Gemini API (Phase 2 connector) */}
                  <path
                    d={`M 180 280 L 300 280`}
                    fill="transparent"
                    stroke={nodes[3].progress > 0 ? "#2563EB" : "#CBD5E1"}
                    strokeWidth={nodes[3].progress > 0 ? 3 : 2}
                    markerEnd={`url(#${nodes[3].progress > 0 ? "arrow-active" : "arrow"})`}
                  />
                </svg>

                {/* Nodes rendering */}
                {nodes.map((node) => {
                  const isCompleted = node.progress === 100;
                  const isInProgress = node.progress > 0 && node.progress < 100;
                  
                  return (
                    <motion.div
                      key={node.id}
                      className="roadmap-node absolute cursor-pointer select-none"
                      style={{ left: node.x, top: node.y }}
                      onMouseEnter={(e) => handleNodeMouseEnter(e, node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setDrawerNode(node);
                        } else {
                          router.push(`/learn/${node.slug}`);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`h-11 w-36 rounded-xl flex items-center justify-between px-3 border transition-all ${
                          isCompleted
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                            : isInProgress
                            ? "bg-blue-50 border-primary text-primary shadow-sm ring-2 ring-primary/20 animate-pulse"
                            : "bg-white border-border-main text-text-main hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <BookOpen className={`h-4.5 w-4.5 shrink-0 ${isCompleted ? "text-emerald-600" : isInProgress ? "text-primary" : "text-muted-main"}`} />
                          <span className="text-xs font-extrabold truncate leading-none">
                            {node.title.includes("C++") ? "C++ Core" :
                             node.title.includes("Java") ? "Java DSA" :
                             node.title.includes("Python") ? "Python DSA" :
                             node.title.includes("JavaScript") ? "Modern JS" :
                             node.title.includes("Next.js") ? "Next.js 14" :
                             node.title.includes("Framer") ? "Motion UX" :
                             node.title.includes("PostgreSQL") ? "SQL Design" :
                             node.title.includes("Gemini") ? "LLM Agents" : node.title}
                          </span>
                        </div>
                        {isCompleted && (
                          <div className="h-4.5 w-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] shrink-0 font-bold">
                            ✔
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Phase labels */}
                <span className="absolute left-[120px] top-[50px] text-[10px] font-bold text-muted-main uppercase tracking-widest pointer-events-none select-none">
                  {track === "dsa" ? "Phase 1: Core Languages" : "Phase 1: Foundations"}
                </span>
                <span className="absolute left-[120px] top-[230px] text-[10px] font-bold text-muted-main uppercase tracking-widest pointer-events-none select-none">
                  {track === "dsa" ? "Phase 2: DSA & Advanced" : "Phase 2: Advanced Engineering"}
                </span>

              </div>

              {/* Pan & Zoom Canvas Overlay Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-20 canvas-button select-none">
                <button
                  onClick={() => handleZoom(1.15)}
                  className="h-8 w-8 bg-white border border-border-main hover:bg-slate-50 text-dark rounded-lg shadow-sm flex items-center justify-center transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleZoom(0.85)}
                  className="h-8 w-8 bg-white border border-border-main hover:bg-slate-50 text-dark rounded-lg shadow-sm flex items-center justify-center transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={resetCanvas}
                  className="h-8 w-8 bg-white border border-border-main hover:bg-slate-50 text-dark rounded-lg shadow-sm flex items-center justify-center transition-colors"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Canvas Desktop Hover Tooltip */}
              <AnimatePresence>
                {hoveredNode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute z-30 w-52 bg-white rounded-xl shadow-lg border border-border-main p-4 flex flex-col gap-3 pointer-events-auto"
                    style={{
                      left: tooltipPos.x - 104, // Center align (half of width 52 = 208px -> 104)
                      top: tooltipPos.y - 150 // Offset tooltip height
                    }}
                  >
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-[10px] text-muted-main font-bold uppercase tracking-wider">{hoveredNode.phase}</span>
                      <h4 className="font-extrabold text-xs text-dark mt-0.5 leading-snug">{hoveredNode.title}</h4>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-main select-none">
                      <span>Videos: {hoveredNode.videoCount}</span>
                      <span>Problems: {hoveredNode.problemCount}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-bold">
                      <span className="text-emerald-600 leading-none">Progress: {hoveredNode.progress}%</span>
                      <Link
                        href={`/learn/${hoveredNode.slug}`}
                        className="px-2.5 py-1 bg-primary hover:bg-primary-hover text-white text-[9px] font-extrabold rounded-md flex items-center gap-0.5"
                      >
                        <span>Study</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* DEV-MODE STATE SANDBOX CONTROLLER */}
          {/* ========================================================================= */}
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
                Empty / Unstarted Track
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MOBILE BOTTOM SLIDE DRAWER VIEW */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {drawerNode && (
              <>
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerNode(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer md:hidden"
                />

                {/* Sliding drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-main z-50 shadow-2xl rounded-t-3xl p-5 flex flex-col gap-4 select-none md:hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-main font-bold uppercase tracking-wider">{drawerNode.phase}</span>
                      <h3 className="font-extrabold text-sm text-dark mt-1 leading-snug">{drawerNode.title}</h3>
                    </div>
                    <button
                      onClick={() => setDrawerNode(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-muted-main"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-bg-main rounded-xl border border-border-main/50 flex flex-col">
                      <span className="text-xs font-extrabold text-dark leading-none">{drawerNode.videoCount}</span>
                      <span className="text-[9px] text-muted-main font-bold mt-1 uppercase tracking-wider">Lectures</span>
                    </div>
                    <div className="p-3 bg-bg-main rounded-xl border border-border-main/50 flex flex-col">
                      <span className="text-xs font-extrabold text-dark leading-none">{drawerNode.blogCount}</span>
                      <span className="text-[9px] text-muted-main font-bold mt-1 uppercase tracking-wider">Articles</span>
                    </div>
                    <div className="p-3 bg-bg-main rounded-xl border border-border-main/50 flex flex-col">
                      <span className="text-xs font-extrabold text-dark leading-none">{drawerNode.problemCount}</span>
                      <span className="text-[9px] text-muted-main font-bold mt-1 uppercase tracking-wider">Problems</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold mt-2">
                    <span className="text-emerald-600 leading-none">Progress: {drawerNode.progress}% Completed</span>
                    <Link
                      href={`/learn/${drawerNode.slug}`}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-lg shadow-sm flex items-center gap-1"
                    >
                      <span>Study Syllabus</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
}
