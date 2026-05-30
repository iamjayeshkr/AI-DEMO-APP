"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import usersData from "@/mock/users.json";

interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  streak: number;
  level: number;
  xp: number;
  activePlan: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  // Google Account Direct Sign In State
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("thinkera_session");
      if (savedSession) {
        try {
          setUser(JSON.parse(savedSession));
        } catch {
          localStorage.removeItem("thinkera_session");
        }
      }
      setLoading(false);

      // Ensure dark mode is completely removed from the document root
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Dynamic Route Guard redirects
  useEffect(() => {
    if (!loading) {
      const isPublicPath = pathname === "/login" || pathname === "/";
      if (!user && !isPublicPath) {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = () => {
    setIsSigningIn(true);
    
    // Simulate secure direct Google OAuth authentication handshake
    setTimeout(() => {
      // Find default mock student (Rudra Dev)
      const matchedMockUser = usersData.find(u => u.email === "student@thinkera.io");
      
      let sessionUser: UserSession;
      
      if (matchedMockUser) {
        sessionUser = {
          id: matchedMockUser.id,
          email: matchedMockUser.email,
          name: matchedMockUser.name,
          avatar: matchedMockUser.avatar,
          role: matchedMockUser.role,
          streak: matchedMockUser.streak,
          level: matchedMockUser.level,
          xp: matchedMockUser.xp,
          activePlan: matchedMockUser.activePlan
        };
      } else {
        sessionUser = {
          id: "user-student-1",
          email: "student@thinkera.io",
          name: "Rudra Dev",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra",
          role: "student",
          streak: 14,
          level: 3,
          xp: 1840,
          activePlan: "Pro Learner"
        };
      }

      setUser(sessionUser);
      localStorage.setItem("thinkera_session", JSON.stringify(sessionUser));
      
      setIsSigningIn(false);
      router.push("/dashboard");
    }, 1200);
  };

  const signOut = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem("thinkera_session");
      setLoading(false);
      router.push("/login");
    }, 800);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}

      {/* ========================================================================= */}
      {/* DIRECT GOOGLE SIGN-IN INTERACTIVE LOADER OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSigningIn && (
          <>
            {/* Glassmorphic Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[990]"
            />

            {/* Premium Handshake Indicator Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white border border-slate-200 z-[995] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center font-sans text-center select-none"
            >
              {/* Spinner Container */}
              <div className="relative flex items-center justify-center h-16 w-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
                <svg className="h-7 w-7 relative z-10 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
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
              </div>

              {/* Title & Desc */}
              <h4 className="font-extrabold text-slate-800 text-sm leading-tight mb-1">
                Connecting to Google Accounts
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold mb-4 leading-relaxed">
                Establishing secure authentication session...
              </p>

              {/* User Identity Chip */}
              <div className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Rudra"
                  alt="Rudra Dev"
                  className="h-8 w-8 rounded-full border border-slate-200"
                />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-extrabold text-[11px] text-slate-700">Rudra Dev</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-1">student@thinkera.io</span>
                </div>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase tracking-wide">
                  Default
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
