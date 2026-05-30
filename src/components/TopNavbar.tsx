"use"
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Compass,
  Code,
  Users,
  Clock,
  Sparkles,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  X,
  Activity
} from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, signOut, signInWithGoogle } = useAuth();

  // Mock Notifications
  const notifications = [
    { id: 1, text: "Sarah Chen replied to your DSA doubt thread", time: "2h ago", unread: true },
    { id: 2, text: "Your daily coding streak is secured! (14 days)", time: "5h ago", unread: false },
    { id: 3, text: "New Intermediate problem added to roadmaps", time: "1d ago", unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAvatarDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Learn", href: "/learn", icon: BookOpen },
    { label: "Roadmap", href: "/roadmap", icon: Compass },
    { label: "Problems", href: "/problems", icon: Code },
    { label: "Community", href: "/community/doubts", icon: Users },
    { label: "Focus", href: "/focus", icon: Clock },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/roadmap") {
      return pathname.startsWith("/roadmap");
    }
    if (href === "/learn") {
      return pathname.startsWith("/learn");
    }
    if (href === "/community/doubts") {
      return pathname.startsWith("/community");
    }
    return pathname === href;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glassmorphism shadow-md py-3"
            : "bg-white/90 border-b border-border-main py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:bg-primary-hover transition-all duration-300">
                  <span className="font-bold text-lg select-none">T</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-dark group-hover:text-primary transition-colors duration-300">
                  Think<span className="text-primary group-hover:text-dark">Era</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      active
                        ? "text-primary bg-primary/5"
                        : "text-muted-main hover:text-dark hover:bg-black/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Icons / User Profile */}
            <div className="flex items-center gap-3">
              
              {user ? (
                <>
                  {/* AI Mentor glowing icon */}
                  <Link href="/problems" className="relative group p-2 rounded-lg hover:bg-black/5 transition-colors">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg scale-0 group-hover:scale-100 group-hover:animate-ping opacity-60 transition-transform duration-300" />
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </Link>

                  {/* Streak Counter Dashboard */}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 font-semibold text-xs">
                    <span>🔥</span>
                    <span>{user.streak} Days</span>
                  </div>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        setAvatarDropdownOpen(false);
                      }}
                      className={`p-2 rounded-lg hover:bg-black/5 transition-colors relative ${
                        notificationsOpen ? "bg-black/5 text-dark" : "text-muted-main"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white animate-bounce" />
                      )}
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border-main py-2 overflow-hidden z-50"
                        >
                          <div className="px-4 py-2 border-b border-border-main flex items-center justify-between">
                            <span className="font-bold text-sm text-dark">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`px-4 py-3 hover:bg-bg-main transition-colors border-b border-border-main last:border-b-0 cursor-pointer flex flex-col gap-1 ${
                                  n.unread ? "bg-primary/5" : ""
                                }`}
                              >
                                <p className="text-xs text-text-main leading-relaxed font-medium">{n.text}</p>
                                <span className="text-[10px] text-muted-main">{n.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Profile Avatar Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setAvatarDropdownOpen(!avatarDropdownOpen);
                        setNotificationsOpen(false);
                      }}
                      className="flex items-center gap-1 p-1 rounded-full hover:bg-black/5 transition-colors"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border border-border-main"
                      />
                      <ChevronDown className="h-4 w-4 text-muted-main hidden sm:inline" />
                    </button>

                    <AnimatePresence>
                      {avatarDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border-main py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border-main bg-bg-main/50">
                            <p className="font-bold text-sm text-dark leading-none">{user.name}</p>
                            <p className="text-xs text-muted-main mt-1.5">Level {user.level} Student</p>
                          </div>
                          <div className="py-1">
                            <Link
                              href={`/profile/${user.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-bg-main hover:text-dark transition-colors"
                            >
                              <User className="h-4 w-4 text-muted-main" />
                              My Profile
                            </Link>
                            <Link
                              href="/settings"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-bg-main hover:text-dark transition-colors"
                            >
                              <Settings className="h-4 w-4 text-muted-main" />
                              Account Settings
                            </Link>
                          </div>
                          <div className="border-t border-border-main pt-1">
                            <button
                              onClick={signOut}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Anonymous Google Auth Trigger Button */
                <button
                  onClick={signInWithGoogle}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors text-muted-main md:hidden"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border-main bg-white shadow-lg overflow-hidden fixed top-[69px] left-0 right-0 z-40"
          >
            <div className="px-4 py-4 space-y-2 flex flex-col">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "text-primary bg-primary/5"
                        : "text-text-main hover:bg-bg-main"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              {user && (
                <div className="border-t border-border-main pt-3 mt-3 flex items-center justify-between px-4">
                  <span className="text-xs text-muted-main">Current Streak:</span>
                  <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 font-bold text-xs rounded-full">
                    🔥 {user.streak} Days
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
