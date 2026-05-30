"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  HelpCircle,
  BookOpen,
  Trophy,
  Search,
  Filter,
  Plus,
  Flame,
  CheckCircle,
  X,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Bug,
  CornerDownRight,
  Calendar,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import CommunitySkeleton from "@/components/CommunitySkeleton";

// Interfaces
interface Author {
  name: string;
  avatar: string;
  role: "student" | "admin";
  badge: string;
}

interface Reply {
  id: string;
  author: Author;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  content: string;
  isSolution?: boolean;
}

interface ForumPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: Author;
  createdAt: string;
  upvotes: number;
  hasUpvoted: boolean;
  repliesCount: number;
  tags: string[];
  content: string;
  type: "doubts" | "discussions" | "resources" | "achievements";
  resolved?: boolean;
  replies: Reply[];
  codeSnippet?: string;
  xpGained?: number; // for achievements
}

export default function CommunityDashboard() {
  const params = useParams();
  const router = useRouter();

  // dynamic parameter: doubts | discussions | resources | achievements
  const section = (params.section as string) || "doubts";

  // 4 QA states: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true);

  // Community posts list state
  const [posts, setPosts] = useState<ForumPost[]>([]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSort, setFilterSort] = useState<"latest" | "top" | "unanswered">("latest");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Post Creator Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"doubts" | "discussions" | "resources" | "achievements">("doubts");
  const [newCategory, setNewCategory] = useState("General");
  const [newTagsString, setNewTagsString] = useState("");
  const [newCodeSnippet, setNewCodeSnippet] = useState("");

  // Slide-Over Detail Panel state
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [newReplyText, setNewReplyText] = useState("");

  // Simulated async mock-loading & recovery
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem("thinkera_community_posts");
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        // Initial setup from default JSON & injected assets
        const initialMockPosts: ForumPost[] = [
          {
            id: "thread-1",
            title: "Why should I use React Server Components (RSC) instead of simple useEffect fetching?",
            slug: "rsc-vs-useeffect",
            category: "Next.js & React",
            author: {
              name: "Sarah Chen",
              avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
              role: "student",
              badge: "React Specialist"
            },
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            upvotes: 42,
            hasUpvoted: false,
            repliesCount: 2,
            tags: ["React", "NextJS", "Data Fetching"],
            content: "I'm building a dashboard and originally fetched all my data using a standard client-side `useEffect` and an API call. I'm migrating to Next.js App Router and I keep hearing that RSC is the future. Can someone explain the tangible performance benefits of fetching on the server versus client side?",
            type: "doubts",
            resolved: true,
            replies: [
              {
                id: "reply-1-1",
                author: {
                  name: "Alex Mercer",
                  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
                  role: "admin",
                  badge: "Staff Mentor"
                },
                createdAt: new Date(Date.now() - 1.9 * 24 * 3600 * 1000).toISOString(),
                upvotes: 15,
                content: "Great question Sarah! The main advantages of React Server Components (RSC) are:\n\n1. **Zero Client-side Bundle Size:** All libraries used to fetch/format data stay on the server. Your bundle is lighter.\n2. **Direct Backend Access:** You can query databases directly inside the component without having to write separate API endpoints.\n3. **SEO Friendly:** HTML is generated on the server and sent to the client instantly, which is excellent for search engines.",
                isSolution: true
              },
              {
                id: "reply-1-2",
                author: {
                  name: "David Miller",
                  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
                  role: "student",
                  badge: "Rising Star"
                },
                createdAt: new Date(Date.now() - 1.8 * 24 * 3600 * 1000).toISOString(),
                upvotes: 4,
                content: "Also, you avoid the 'waterfall fetching' problem. With standard React client-side fetching, components fetch sequentially as they render. With RSC, you can parallelize requests on the server close to your data source!"
              }
            ]
          },
          {
            id: "thread-2",
            title: "Tips on mastering Framer Motion spring configurations?",
            slug: "framer-motion-spring-tips",
            category: "Animations & UI",
            author: {
              name: "Emma Watson",
              avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
              role: "student",
              badge: "Creative Developer"
            },
            createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
            upvotes: 28,
            hasUpvoted: true,
            repliesCount: 1,
            tags: ["Framer Motion", "Tailwind", "CSS"],
            content: "Every time I build animations with Framer Motion, using standard spring parameters feels either too floppy or too stiff. Are there standard configurations you guys use for general dashboard cards, popovers, and menu dropdowns?",
            type: "discussions",
            replies: [
              {
                id: "reply-2-1",
                author: {
                  name: "Sophia Vance",
                  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
                  role: "admin",
                  badge: "UX Director"
                },
                createdAt: new Date(Date.now() - 0.9 * 24 * 3600 * 1000).toISOString(),
                upvotes: 12,
                content: "Hey Emma! For high-quality, professional micro-animations, less is more. Avoid default spring settings for general utility UI. Try these:\n\n* **Bouncy Popovers:** `type: 'spring', stiffness: 300, damping: 20`\n* **Smooth Sidebars/Sliders:** `type: 'spring', stiffness: 260, damping: 26` (No bounce, clean tracking)\n* **Hover Cards:** `type: 'spring', stiffness: 400, damping: 30` (Snappy and instant)"
              }
            ]
          },
          {
            id: "thread-3",
            title: "Best practices for writing secure server actions?",
            slug: "secure-server-actions",
            category: "Security & Backend",
            author: {
              name: "Marcus Aurelius",
              avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
              role: "student",
              badge: "Backend Dev"
            },
            createdAt: new Date(Date.now() - 0.5 * 24 * 3600 * 1000).toISOString(),
            upvotes: 19,
            hasUpvoted: false,
            repliesCount: 0,
            tags: ["NextJS", "Security", "Server Actions"],
            content: "I am setting up a form mutation using Server Actions in Next.js. What's the best way to handle user input validation and authentication checks? Do I need middleware or should everything happen in the action itself?",
            type: "doubts",
            resolved: false,
            replies: []
          },
          {
            id: "thread-4",
            title: "[Resource] Premium Tailwind CSS v4 Dynamic Themes Cheatsheet!",
            slug: "tailwind-cheatsheet",
            category: "Styles & Utility",
            author: {
              name: "Rudra Dev",
              avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra",
              role: "student",
              badge: "Pro Learner"
            },
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
            upvotes: 67,
            hasUpvoted: false,
            repliesCount: 1,
            tags: ["Tailwind", "CSS", "UI Tokens"],
            content: "Hey team! I put together a quick Markdown compilation documenting all the newly introduced CSS utility directives and `@theme` parameters in the Tailwind v4 build system. This really speeds up layout creations inside the Next.js App Router folders!",
            type: "resources",
            replies: [
              {
                id: "reply-4-1",
                author: {
                  name: "Sarah Chen",
                  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
                  role: "student",
                  badge: "React Specialist"
                },
                createdAt: new Date(Date.now() - 2.8 * 24 * 3600 * 1000).toISOString(),
                upvotes: 8,
                content: "This is a lifesaver Rudra! The theme directives in Tailwind v4 are slightly different from earlier versions and this clarifies variables mapping immensely."
              }
            ]
          },
          {
            id: "thread-5",
            title: "🏆 RUDRA DEV JUST CRACKED THE 14-DAY FOCUS STREAK STAGE!",
            slug: "streak-achievement-rudra",
            category: "Streak Milestones",
            author: {
              name: "ThinkEra Bot",
              avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bot",
              role: "admin",
              badge: "Platform Guide"
            },
            createdAt: new Date(Date.now() - 0.1 * 24 * 3600 * 1000).toISOString(),
            upvotes: 89,
            hasUpvoted: false,
            repliesCount: 0,
            tags: ["Streaks", "Consistent", "XP Gained"],
            content: "Huge congratulations to @Rudra Dev for completing at least 1 deep focus session or solving a DSA practice problem daily for 14 days in a row! An active +100 XP has been allocated to his profile stats. Keep up the high consistency!",
            type: "achievements",
            xpGained: 100,
            replies: []
          }
        ];
        setPosts(initialMockPosts);
        localStorage.setItem("thinkera_community_posts", JSON.stringify(initialMockPosts));
      }
    } catch (e) {
      console.error("Localstorage recovery failed", e);
    }

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Sync feed values if pageState is switched in QA controller
  useEffect(() => {
    if (pageState === "empty") {
      setPosts([]);
    } else if (pageState === "success") {
      try {
        const savedPosts = localStorage.getItem("thinkera_community_posts");
        if (savedPosts) setPosts(JSON.parse(savedPosts));
      } catch (e) {}
    }
  }, [pageState]);

  // Handle route not found
  const validSections = ["doubts", "discussions", "resources", "achievements"];
  if (!validSections.includes(section) && !initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-12 gap-6 select-none">
        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-dark">Section Not Found</h2>
          <p className="text-sm text-muted-main leading-relaxed">
            The community section <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">/community/{section}</code> does not exist.
          </p>
        </div>
        <Link
          href="/community/doubts"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Doubts</span>
        </Link>
      </div>
    );
  }

  // Sidebar navigation counts helper
  const getSectionCount = (type: "doubts" | "discussions" | "resources" | "achievements") => {
    return posts.filter(p => p.type === type).length;
  };

  // Upvote optimistically on posts list
  const handlePostUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the detail drawer
    const updated = posts.map(p => {
      if (p.id === postId) {
        const hasUpvoted = !p.hasUpvoted;
        const upvotes = p.upvotes + (hasUpvoted ? 1 : -1);
        return { ...p, hasUpvoted, upvotes };
      }
      return p;
    });
    setPosts(updated);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_community_posts", JSON.stringify(updated));
    }

    // Sync state drawer if it is currently open
    if (activePost && activePost.id === postId) {
      const active = updated.find(p => p.id === postId);
      if (active) setActivePost(active);
    }
  };

  // Upvote optimistically on drawer reply items
  const handleReplyUpvote = (replyId: string) => {
    if (!activePost) return;

    const updatedReplies = activePost.replies.map(r => {
      if (r.id === replyId) {
        const hasUpvoted = !r.hasUpvoted;
        const upvotes = r.upvotes + (hasUpvoted ? 1 : -1);
        return { ...r, hasUpvoted, upvotes };
      }
      return r;
    });

    const updatedPost = { ...activePost, replies: updatedReplies };
    setActivePost(updatedPost);

    // Save back to main state
    const updatedPosts = posts.map(p => (p.id === activePost.id ? updatedPost : p));
    setPosts(updatedPosts);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_community_posts", JSON.stringify(updatedPosts));
    }
  };

  // Ask / Create thread submit handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagList = newTagsString
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newPost: ForumPost = {
      id: "thread-" + Math.random().toString(36).substr(2, 9),
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newCategory,
      author: {
        name: "Rudra Dev",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra",
        role: "student",
        badge: "Pro Learner"
      },
      createdAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      repliesCount: 0,
      tags: tagList.length > 0 ? tagList : ["General"],
      content: newContent,
      type: newType,
      resolved: newType === "doubts" ? false : undefined,
      replies: [],
      codeSnippet: newCodeSnippet.trim() || undefined
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_community_posts", JSON.stringify(updated));
    }

    // Reset Form & Close Modal
    setNewTitle("");
    setNewContent("");
    setNewTagsString("");
    setNewCodeSnippet("");
    setShowCreateModal(false);
  };

  // Reply Composer submit handler inside Detail Slide-Over
  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !newReplyText.trim()) return;

    const newReply: Reply = {
      id: "reply-" + Math.random().toString(36).substr(2, 9),
      author: {
        name: "Rudra Dev",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra",
        role: "student",
        badge: "Pro Learner"
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      content: newReplyText
    };

    const updatedReplies = [...activePost.replies, newReply];
    const updatedPost = {
      ...activePost,
      replies: updatedReplies,
      repliesCount: updatedReplies.length
    };

    setActivePost(updatedPost);

    // Save back to main state
    const updatedPosts = posts.map(p => (p.id === activePost.id ? updatedPost : p));
    setPosts(updatedPosts);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_community_posts", JSON.stringify(updatedPosts));
    }

    setNewReplyText("");
  };

  // Toggle doubt resolution solution badges
  const handleMarkAsSolution = (replyId: string) => {
    if (!activePost) return;

    // Toggle solutions states
    const updatedReplies = activePost.replies.map(r => ({
      ...r,
      isSolution: r.id === replyId ? !r.isSolution : false // one solution limit
    }));

    const hasSolution = updatedReplies.some(r => r.isSolution);
    const updatedPost = {
      ...activePost,
      replies: updatedReplies,
      resolved: hasSolution
    };

    setActivePost(updatedPost);

    // Save back to main state
    const updatedPosts = posts.map(p => (p.id === activePost.id ? updatedPost : p));
    setPosts(updatedPosts);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_community_posts", JSON.stringify(updatedPosts));
    }
  };

  // General feed filter calculations
  const filteredPosts = posts
    // 1. Filter by route parameter category (section)
    .filter(p => p.type === section)
    // 2. Search box debounced filter (title + content + tags)
    .filter(p => {
      const matchQuery = searchQuery.toLowerCase();
      if (!matchQuery) return true;
      return (
        p.title.toLowerCase().includes(matchQuery) ||
        p.content.toLowerCase().includes(matchQuery) ||
        p.tags.some(t => t.toLowerCase().includes(matchQuery))
      );
    })
    // 3. Left sidebar selected Category Tag filter
    .filter(p => {
      if (selectedTag === "All") return true;
      return p.tags.includes(selectedTag);
    })
    // 4. Sort dropdown calculations
    .sort((a, b) => {
      if (filterSort === "top") {
        return b.upvotes - a.upvotes;
      }
      if (filterSort === "unanswered") {
        return a.repliesCount - b.repliesCount;
      }
      // default: latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Extract all distinct tag chips across feed to display filter badges
  const feedTags = ["All", ...Array.from(new Set(posts.filter(p => p.type === section).flatMap(p => p.tags)))];

  // Recovery trigger for corrupted state
  const resetEntireModule = () => {
    localStorage.removeItem("thinkera_community_posts");
    setPageState("success");
    router.refresh();
  };

  if (initialLoading || pageState === "loading") {
    return <CommunitySkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 w-full max-w-7xl mx-auto select-none relative min-h-[calc(100vh-120px)]">
      
      {/* ========================================================================= */}
      {/* ERROR FALLBACK STATE */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="flex-grow bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[500px]">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-dark">Community Forums Corrupted</h3>
          <p className="text-xs text-muted-main max-w-xs leading-relaxed">
            We encountered parsing issues reading your cached community draft threads. Reset local state to restore communication pathways.
          </p>
          <button
            onClick={resetEntireModule}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Forums Cache</span>
          </button>
        </div>
      )}

      {pageState !== "error" && (
        <>
          {/* 1. Contextual Left Sidebar Section Switchers */}
          <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
              <span className="text-[10px] text-primary font-black uppercase tracking-wider">ThinkEra Forums</span>
              <h3 className="font-extrabold text-sm text-dark tracking-tight leading-none mt-0.5">Community Channels</h3>
            </div>

            {/* Segment Switcher Links */}
            <div className="flex flex-col gap-2">
              {[
                { type: "doubts", label: "Doubts Solver", icon: HelpCircle },
                { type: "discussions", label: "Concept Discuss", icon: MessageSquare },
                { type: "resources", label: "Resources & Blogs", icon: BookOpen },
                { type: "achievements", label: "Streak Triumphs", icon: Trophy }
              ].map((chan) => {
                const isActive = section === chan.type;
                const Icon = chan.icon;
                const count = getSectionCount(chan.type as any);

                return (
                  <Link
                    key={chan.type}
                    href={`/community/${chan.type}`}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-blue-50 border-blue-200 text-primary shadow-xs font-bold"
                        : "bg-white border-transparent text-muted-main hover:bg-slate-50 hover:text-dark"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary animate-pulse" : "text-slate-400"}`} />
                      <span className="text-xs font-semibold leading-none">{chan.label}</span>
                    </div>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full leading-none ${
                        isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Sidebar tags dynamic filtering panel */}
            {feedTags.length > 1 && (
              <div className="flex flex-col gap-2.5 select-none pt-2 border-t border-slate-100">
                <span className="text-[9px] font-black text-muted-main uppercase tracking-wider">Filter Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {feedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold border transition-all ${
                        selectedTag === tag
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-muted-main hover:border-slate-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Post button CTA */}
            <button
              onClick={() => {
                setNewType(section as any);
                setShowCreateModal(true);
              }}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{section === "doubts" ? "Ask a Doubt" : section === "resources" ? "Share Resource" : "Create Post"}</span>
            </button>

          </div>

          {/* 2. Main Stream Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Top filter dashboard bar */}
            <div className="bg-white border border-border-main p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm select-none">
              
              {/* Search Box */}
              <div className="relative w-full sm:max-w-xs flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search ${section}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 text-xs font-semibold focus:outline-none bg-transparent text-dark placeholder-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-dark p-0.5">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Feed Sorting Dropdown */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl w-full sm:w-auto">
                {[
                  { sort: "latest", label: "Latest" },
                  { sort: "top", label: "Top Upvoted" },
                  { sort: "unanswered", label: "Unanswered" }
                ].map((item) => (
                  <button
                    key={item.sort}
                    onClick={() => setFilterSort(item.sort as any)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[9px] font-black text-center transition-all ${
                      filterSort === item.sort
                        ? "bg-white text-dark shadow-xs border border-border-main/50"
                        : "text-muted-main hover:text-dark"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Dynamic Card Feed list */}
            <div className="flex flex-col gap-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white border border-border-main p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[300px]">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1 max-w-xs">
                    <span className="font-extrabold text-sm text-dark">No Forum Threads Found</span>
                    <p className="text-[10px] text-muted-main leading-relaxed">
                      {searchQuery
                        ? `No matching topics found for "${searchQuery}". Try editing filters.`
                        : `Be the very first learner to post an entry inside the /community/${section} channels!`}
                    </p>
                  </div>
                  {!searchQuery && (
                    <button
                      onClick={() => {
                        setNewType(section as any);
                        setShowCreateModal(true);
                      }}
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors mt-2"
                    >
                      Create First Thread
                    </button>
                  )}
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const hasSolution = post.resolved;
                  
                  return (
                    <motion.div
                      layoutId={`post-container-${post.id}`}
                      key={post.id}
                      onClick={() => setActivePost(post)}
                      className="bg-white border border-border-main hover:border-slate-300 p-5 rounded-2xl flex flex-col gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all select-none"
                    >
                      {/* 1. Header author details */}
                      <div className="flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-dark leading-none">{post.author.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-primary text-[8px] font-black uppercase tracking-wider">
                                {post.author.badge}
                              </span>
                            </div>
                            <span className="text-[9px] text-muted-main font-semibold mt-0.5">
                              Posted {new Date(post.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Resolved Badge for doubts */}
                        {post.type === "doubts" && (
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1 border shrink-0 ${
                            hasSolution
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}>
                            <CheckCircle className={`h-3 w-3 ${hasSolution ? "text-emerald-600" : "text-amber-500"}`} />
                            <span>{hasSolution ? "Resolved" : "Open Doubt"}</span>
                          </span>
                        )}
                      </div>

                      {/* 2. Post Title & content snippet */}
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <h4 className="text-sm font-black text-dark tracking-tight leading-snug hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-main leading-relaxed line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      {/* 3. Footer tag chips & upvote counters */}
                      <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 shrink-0 select-none mt-1">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-50 border border-slate-100/50 rounded-md text-[9px] font-bold text-slate-500"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 font-bold">
                          {/* Optimistic Flame Upvote button */}
                          <button
                            onClick={(e) => handlePostUpvote(post.id, e)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] transition-all hover:bg-slate-50 ${
                              post.hasUpvoted
                                ? "bg-orange-50 border-orange-200 text-orange-600"
                                : "bg-white border-slate-200 text-slate-400"
                            }`}
                          >
                            <Flame className={`h-3.5 w-3.5 ${post.hasUpvoted ? "fill-current text-orange-500" : ""}`} />
                            <span>{post.upvotes}</span>
                          </button>

                          {/* Reply counter */}
                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                            <span>{post.repliesCount} replies</span>
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SLIDE-OVER DETAIL THREAD DRAWER OVERLAY */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {activePost && (
              <>
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePost(null)}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs cursor-pointer"
                />

                {/* Sliding Right Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="fixed right-0 top-0 bottom-0 z-50 w-full md:max-w-2xl bg-white border-l border-border-main shadow-2xl flex flex-col min-h-0 select-none"
                >
                  {/* Drawer Toolbar Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <span className="text-[10px] text-primary font-black uppercase tracking-wider">
                      Channel Thread details
                    </span>
                    <button
                      onClick={() => setActivePost(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-dark transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Drawer Thread Content area */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 min-h-0">
                    
                    {/* Primary post content block */}
                    <div className="flex flex-col gap-4">
                      
                      {/* Author credentials */}
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={activePost.author.avatar}
                            alt={activePost.author.name}
                            className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-dark leading-none">{activePost.author.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-primary text-[8px] font-black uppercase tracking-wider">
                                {activePost.author.badge}
                              </span>
                            </div>
                            <span className="text-[9px] text-muted-main font-semibold mt-0.5">
                              Posted {new Date(activePost.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Doubt tags state */}
                        {activePost.type === "doubts" && (
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1 border shrink-0 ${
                            activePost.resolved
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            <span>{activePost.resolved ? "Resolved" : "Open Doubt"}</span>
                          </span>
                        )}
                      </div>

                      {/* Thread Details Text */}
                      <div className="flex flex-col gap-2 text-dark select-text">
                        <h2 className="text-base font-black leading-snug tracking-tight">
                          {activePost.title}
                        </h2>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap mt-1">
                          {activePost.content}
                        </p>
                      </div>

                      {/* Display Code snippet block if configured */}
                      {activePost.codeSnippet && (
                        <div className="flex flex-col gap-1.5 select-text">
                          <span className="text-[9px] font-black text-muted-main uppercase tracking-wider">Thread Code Attachment:</span>
                          <pre className="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed shadow-inner">
                            <code>{activePost.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Display achievement XP if configured */}
                      {activePost.xpGained && (
                        <div className="bg-orange-50 border border-orange-200/50 p-4 rounded-xl flex items-center justify-between">
                          <span className="text-[10px] text-orange-800 font-extrabold uppercase tracking-wider">Milestone Achievement Bonus:</span>
                          <span className="text-xs font-black text-orange-700 flex items-center gap-1 bg-white border border-orange-200 px-3 py-1 rounded-lg">
                            <Sparkles className="h-3.5 w-3.5 fill-current text-orange-500 animate-spin" style={{ animationDuration: "6s" }} />
                            <span>+{activePost.xpGained} XP Allocated</span>
                          </span>
                        </div>
                      )}

                      {/* Bottom post metrics upvotes */}
                      <div className="flex items-center justify-between border-t border-b border-slate-100 py-3 select-none">
                        <div className="flex flex-wrap gap-1">
                          {activePost.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={(e) => handlePostUpvote(activePost.id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:bg-slate-50 ${
                            activePost.hasUpvoted
                              ? "bg-orange-50 border-orange-200 text-orange-600 animate-pulse"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          <Flame className="h-4 w-4" />
                          <span>{activePost.upvotes} Upvotes</span>
                        </button>
                      </div>

                    </div>

                    {/* Replies feed stream list */}
                    <div className="flex flex-col gap-4 select-none">
                      <h4 className="font-extrabold text-xs text-dark border-b border-slate-50 pb-2">
                        Replies List ({activePost.replies.length})
                      </h4>

                      {activePost.replies.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 italic">
                          No replies posted yet. Share your thoughts using the composer.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {activePost.replies.map((reply) => {
                            const isThreadAuthor = activePost.author.name === "Rudra Dev"; // Current mock session user
                            
                            return (
                              <div
                                key={reply.id}
                                className={`p-4 rounded-2xl flex flex-col gap-3 shadow-xs border transition-all ${
                                  reply.isSolution
                                    ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/10"
                                    : "bg-bg-main/30 border-border-main/50"
                                }`}
                              >
                                {/* Reply author */}
                                <div className="flex items-center justify-between shrink-0">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={reply.author.avatar}
                                      alt={reply.author.name}
                                      className="h-7 w-7 rounded-full bg-slate-50 border border-slate-100"
                                    />
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-extrabold text-dark leading-none">{reply.author.name}</span>
                                        <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 text-[7px] font-black uppercase tracking-wider">
                                          {reply.author.badge}
                                        </span>
                                      </div>
                                      <span className="text-[8px] text-muted-main font-semibold mt-0.5">
                                        {new Date(reply.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right tools (Upvote / Solutions marking) */}
                                  <div className="flex items-center gap-1.5">
                                    {/* Mark as Solution check mark (doubt authors only) */}
                                    {activePost.type === "doubts" && (isThreadAuthor || reply.isSolution) && (
                                      <button
                                        onClick={() => handleMarkAsSolution(reply.id)}
                                        disabled={!isThreadAuthor}
                                        className={`px-2 py-1 border rounded-lg text-[9px] font-black transition-all ${
                                          reply.isSolution
                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                                            : "bg-white border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300"
                                        } ${!isThreadAuthor ? "cursor-default" : "cursor-pointer hover:scale-105"}`}
                                        title={isThreadAuthor ? "Mark this reply as the solution" : "Marked as solution"}
                                      >
                                        ✔ {reply.isSolution ? "Solution" : "Mark Solution"}
                                      </button>
                                    )}

                                    {/* Reply Upvote */}
                                    <button
                                      onClick={() => handleReplyUpvote(reply.id)}
                                      className={`h-7 w-12 rounded-lg border text-[9px] font-black flex items-center justify-center gap-0.5 hover:bg-slate-50 ${
                                        reply.hasUpvoted
                                          ? "bg-orange-50 border-orange-200 text-orange-600 animate-pulse"
                                          : "bg-white border-slate-200 text-slate-400"
                                      }`}
                                    >
                                      <Flame className="h-3 w-3" />
                                      <span>{reply.upvotes}</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Reply Text content */}
                                <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap pl-9 select-text">
                                  {reply.content}
                                </p>

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Drawer Reply composer form */}
                  <form onSubmit={handleCreateReply} className="p-4 border-t border-slate-100 shrink-0 bg-slate-50 select-none">
                    <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-3 py-2">
                      <CornerDownRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Write a helpful response thread..."
                        value={newReplyText}
                        onChange={(e) => setNewReplyText(e.target.value)}
                        className="w-full px-1 text-xs font-semibold focus:outline-none bg-transparent text-dark placeholder-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!newReplyText.trim()}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                          newReplyText.trim()
                            ? "bg-primary hover:bg-primary-hover text-white shadow-md active:scale-95"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* HIGH-FIDELITY FLOATING POST CREATOR MODAL DIALOG */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {showCreateModal && (
              <>
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCreateModal(false)}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
                />

                {/* Form Card Popup Dialog */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="fixed inset-x-4 top-6 md:top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white border border-border-main z-50 shadow-2xl rounded-2xl p-6 select-none max-h-[85vh] overflow-y-auto"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-dark flex items-center gap-1.5">
                      <Plus className="h-4.5 w-4.5 text-primary" />
                      <span>{newType === "doubts" ? "Ask a coding Doubt" : "Share a Thread Post"}</span>
                    </h3>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-dark transition-colors"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Creator Form */}
                  <form onSubmit={handleCreatePost} className="flex flex-col gap-4 mt-4 text-xs">
                    
                    {/* Channel Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Select Forum Channel:</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold bg-white cursor-pointer"
                      >
                        <option value="doubts">Doubts Solver</option>
                        <option value="discussions">Concept Discussions</option>
                        <option value="resources">Resources & Blogs</option>
                        <option value="achievements">Streak Achievements</option>
                      </select>
                    </div>

                    {/* Topic Category */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Category (e.g. Arrays, NextJS):</label>
                      <input
                        type="text"
                        placeholder="General / Security / React..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold"
                      />
                    </div>

                    {/* Thread Title */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Post Title:</label>
                      <input
                        type="text"
                        placeholder="Be descriptive with your question or title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold"
                      />
                    </div>

                    {/* Thread Content Body */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Content Description:</label>
                      <textarea
                        rows={4}
                        placeholder="Describe your doubt, share tips, or explain your achievements..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold resize-none"
                      />
                    </div>

                    {/* Optional Code Snippet input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Attach Code Snippet (Optional):</label>
                      <textarea
                        rows={3}
                        placeholder="Paste your source code block here..."
                        value={newCodeSnippet}
                        onChange={(e) => setNewCodeSnippet(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-mono font-semibold resize-none bg-slate-50"
                      />
                    </div>

                    {/* Tag list string */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Tag labels (Comma separated):</label>
                      <input
                        type="text"
                        placeholder="React, NextJS, CSS..."
                        value={newTagsString}
                        onChange={(e) => setNewTagsString(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-1">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-dark font-bold rounded-xl transition-colors text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all text-center"
                      >
                        Publish Thread
                      </button>
                    </div>

                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
                Empty Forums View
              </button>
              <button
                onClick={() => setPageState("error")}
                className="px-2 py-1 rounded-md text-[9px] font-bold col-span-2 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200"
              >
                Simulate Forums Error
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
