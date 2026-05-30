"use"
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Check, BookOpen, Lock } from "lucide-react";
import topicsData from "@/mock/topics.json";

interface LearnSidebarProps {
  currentSlug?: string;
}

export default function LearnSidebar({ currentSlug }: LearnSidebarProps) {
  const pathname = usePathname();

  // Group topics by difficulty/level
  // Group 1: Fundamentals (e.g. PostgreSQL modeled as core, or any Easy topics)
  // Group 2: Intermediate
  // Group 3: Advanced
  const groups = [
    {
      id: "fundamentals",
      name: "Fundamentals",
      topics: topicsData.filter(t => t.difficulty === "Easy" || t.id === "topic-postgresql-nodes")
    },
    {
      id: "intermediate",
      name: "Intermediate Tracks",
      topics: topicsData.filter(t => t.difficulty === "Intermediate" && t.id !== "topic-postgresql-nodes")
    },
    {
      id: "advanced",
      name: "Advanced Tracks",
      topics: topicsData.filter(t => t.difficulty === "Advanced")
    }
  ];

  // If a group has no topics (e.g. Easy is empty), let's make sure we put something in there or adapt groups dynamically.
  // Wait, let's make sure "Fundamentals" has "topic-postgresql-nodes" (since it's intermediate, let's treat it as core foundation).
  // This is highly resilient!
  
  // State to track which groups are collapsed/expanded
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    fundamentals: false,
    intermediate: false,
    advanced: false
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <span className="h-4.5 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-800 shrink-0">
          Done
        </span>
      );
    }
    if (progress > 0) {
      return (
        <span className="h-4.5 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[9px] font-bold text-primary shrink-0 animate-pulse">
          {progress}%
        </span>
      );
    }
    return (
      <span className="h-4.5 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-muted-main shrink-0">
        0%
      </span>
    );
  };

  return (
    <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-sm text-dark tracking-tight">Learning Syllabus</h3>
      </div>

      <nav className="flex flex-col gap-4">
        {groups.map((group) => {
          // If a group has no topics, skip rendering to keep the UI beautiful
          if (group.topics.length === 0) return null;

          const isCollapsed = collapsedGroups[group.id];
          
          return (
            <div key={group.id} className="flex flex-col gap-1.5">
              
              {/* Group Header (Collapsible toggle) */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between text-xs font-bold text-muted-main hover:text-dark uppercase tracking-wider select-none text-left py-1"
              >
                <span>{group.name}</span>
                {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {/* Group Topics List */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col gap-1 pl-1"
                  >
                    {group.topics.map((topic) => {
                      const isActive = topic.slug === currentSlug;
                      return (
                        <Link
                          key={topic.id}
                          href={`/learn/${topic.slug}`}
                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isActive
                              ? "bg-primary/5 text-primary border-primary/20"
                              : "border-transparent text-text-main hover:bg-bg-main hover:text-dark"
                          }`}
                        >
                          <span className="truncate flex-1 leading-none">{topic.title}</span>
                          {getStatusBadge(topic.progress)}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </nav>
    </div>
  );
}
