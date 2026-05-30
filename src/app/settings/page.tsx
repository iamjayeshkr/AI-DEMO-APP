"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Mail,
  Sliders,
  Bell,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Bug,
  Save,
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface FocusSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
}

export default function AccountSettingsPage() {
  const router = useRouter();

  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true);

  // Configuration forms state
  const [name, setName] = useState("Rudra Dev");
  const [email, setEmail] = useState("student@thinkera.io");
  const [level, setLevel] = useState("Intermediate");
  const [goal, setGoal] = useState("Campus Placements");
  
  // Custom toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Status Alerts
  const [successBanner, setSuccessBanner] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  // Simulated async mock-loading & localStorage recovery
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("thinkera_settings_name");
      if (savedName) setName(JSON.parse(savedName));

      const savedEmail = localStorage.getItem("thinkera_settings_email");
      if (savedEmail) setEmail(JSON.parse(savedEmail));

      const savedLevel = localStorage.getItem("thinkera_settings_level");
      if (savedLevel) setLevel(JSON.parse(savedLevel));

      const savedGoal = localStorage.getItem("thinkera_settings_goal");
      if (savedGoal) setGoal(JSON.parse(savedGoal));

      // Sync focus settings sounds
      const focusSettings = localStorage.getItem("thinkera_focus_settings");
      if (focusSettings) {
        const parsed: FocusSettings = JSON.parse(focusSettings);
        setSoundEnabled(parsed.soundEnabled);
      }

      // Restore toggles
      const savedAlerts = localStorage.getItem("thinkera_settings_alerts");
      if (savedAlerts) setAlertsEnabled(JSON.parse(savedAlerts));
    } catch (e) {
      console.error("Localstorage recovery failed", e);
    }

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Sync state variations inside developer sandbox
  useEffect(() => {
    if (pageState === "empty") {
      setName("");
      setEmail("");
      setLevel("Beginner");
      setGoal("General Improvement");
      setSoundEnabled(false);
      setAlertsEnabled(false);
    } else if (pageState === "success") {
      try {
        const savedName = localStorage.getItem("thinkera_settings_name");
        if (savedName) setName(JSON.parse(savedName));
        const savedEmail = localStorage.getItem("thinkera_settings_email");
        if (savedEmail) setEmail(JSON.parse(savedEmail));
      } catch (e) {}
    }
  }, [pageState]);

  // Submit Settings edits
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageState === "error") return;

    // Bounds email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setErrorBanner("Profile Name cannot be empty.");
      setSuccessBanner("");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorBanner("Please supply a valid contact email.");
      setSuccessBanner("");
      return;
    }

    try {
      localStorage.setItem("thinkera_settings_name", JSON.stringify(name));
      localStorage.setItem("thinkera_settings_email", JSON.stringify(email));
      localStorage.setItem("thinkera_settings_level", JSON.stringify(level));
      localStorage.setItem("thinkera_settings_goal", JSON.stringify(goal));
      localStorage.setItem("thinkera_settings_alerts", JSON.stringify(alertsEnabled));

      // Sync focus settings sounds alert
      const focusSettings = localStorage.getItem("thinkera_focus_settings");
      if (focusSettings) {
        const parsed = JSON.parse(focusSettings);
        parsed.soundEnabled = soundEnabled;
        localStorage.setItem("thinkera_focus_settings", JSON.stringify(parsed));
      } else {
        localStorage.setItem(
          "thinkera_focus_settings",
          JSON.stringify({
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            soundEnabled
          })
        );
      }

      // Sync back to student profile object
      const savedProfile = localStorage.getItem("thinkera_student_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        parsed.name = name;
        parsed.email = email;
        localStorage.setItem("thinkera_student_profile", JSON.stringify(parsed));
      }

      setErrorBanner("");
      setSuccessBanner("Account settings saved successfully! Navigation updates are synced.");
      
      // Auto dismiss success
      setTimeout(() => {
        setSuccessBanner("");
      }, 3000);

    } catch (e) {
      setErrorBanner("Failed to write to client storage database.");
    }
  };

  // Flush cached variables
  const resetEntireModule = () => {
    localStorage.removeItem("thinkera_settings_name");
    localStorage.removeItem("thinkera_settings_email");
    localStorage.removeItem("thinkera_settings_level");
    localStorage.removeItem("thinkera_settings_goal");
    localStorage.removeItem("thinkera_settings_alerts");
    setName("Rudra Dev");
    setEmail("student@thinkera.io");
    setLevel("Intermediate");
    setGoal("Campus Placements");
    setSoundEnabled(true);
    setAlertsEnabled(true);
    setPageState("success");
    setSuccessBanner("Configurations reset cleanly!");
    setTimeout(() => setSuccessBanner(""), 2000);
  };

  // Loading skeleton view
  if (initialLoading || pageState === "loading") {
    return (
      <div className="flex flex-col gap-6 animate-pulse w-full max-w-2xl mx-auto py-4 select-none">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-6 w-48 bg-slate-200 rounded" />
        </div>
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-6 shadow-sm min-h-[400px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
          ))}
          <div className="h-11 w-32 bg-slate-200 rounded-xl self-end mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 w-full max-w-2xl mx-auto select-none relative min-h-[calc(100vh-120px)]">
      
      {/* Header index redirect link */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="font-extrabold text-sm text-dark tracking-tight">Account Configuration Settings</h1>
        </div>
        <Link
          href="/profile/rudra-dev"
          className="text-xs font-bold text-muted-main hover:text-dark flex items-center gap-0.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>My Profile</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* ERROR FALLBACK STATE */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[400px]">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center animate-bounce">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-dark">Forms Sync Blocked</h3>
          <p className="text-xs text-muted-main max-w-xs leading-relaxed">
            We discovered hardware failures writing files to client storage structures. Reset logs to clear state blocks.
          </p>
          <button
            onClick={resetEntireModule}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Flush Settings Cache</span>
          </button>
        </div>
      )}

      {pageState !== "error" && (
        <>
          {/* Notifications Success banner */}
          <AnimatePresence>
            {successBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-xs select-none"
              >
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                <span>{successBanner}</span>
              </motion.div>
            )}

            {errorBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-xs select-none"
              >
                <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
                <span>{errorBanner}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form container */}
          <form
            onSubmit={handleSaveSettings}
            className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-6 shadow-sm select-none"
          >
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-slate-600 text-xs flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                <span>Profile Display Name:</span>
              </label>
              <input
                type="text"
                placeholder="Rudra Dev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs text-dark font-semibold shadow-inner"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-slate-600 text-xs flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>Contact Email Address:</span>
              </label>
              <input
                type="email"
                placeholder="student@thinkera.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs text-dark font-semibold shadow-inner"
              />
            </div>

            {/* Experience level dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-slate-600 text-xs flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-slate-400" />
                <span>Experience Level Selection:</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs text-dark font-semibold bg-white cursor-pointer"
              >
                <option value="Beginner">Beginner (0–6 Months Coding)</option>
                <option value="Intermediate">Intermediate (6–24 Months Coding)</option>
                <option value="Advanced">Advanced (Over 24 Months Coding)</option>
              </select>
            </div>

            {/* Goal selection dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-slate-600 text-xs flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-slate-400" />
                <span>Campus Learning Placement Targets:</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs text-dark font-semibold bg-white cursor-pointer"
              >
                <option value="Campus Placements">Crack General Campus Placements</option>
                <option value="Crack FAANG">Secure FAANG Core Software roles</option>
                <option value="Learn DSA Scratch">Learn Core DSA foundations from Scratch</option>
                <option value="General Improvement">Improve general programming concepts</option>
              </select>
            </div>

            {/* Alerts Notifications sound toggles */}
            <div className="border-t border-slate-100 pt-5 mt-2 flex flex-col gap-4">
              <h3 className="font-black text-xs text-dark uppercase tracking-wider mb-1">Preferences Configurations</h3>

              {/* sound toggle */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                    <span>Procedural Audio Alerts</span>
                  </span>
                  <span className="text-[10px] text-muted-main leading-relaxed">
                    Beeps arpeggio melodies when Focus Pomodoro timers expire
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`h-8 px-4 rounded-xl border text-[10px] font-black transition-colors ${
                    soundEnabled ? "bg-blue-50 border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  {soundEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* alerts toggle */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-primary" />
                    <span>In-App Banner Notifications</span>
                  </span>
                  <span className="text-[10px] text-muted-main leading-relaxed">
                    Triggers screen alerts when peers reply to your community doubt threads
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`h-8 px-4 rounded-xl border text-[10px] font-black transition-colors ${
                    alertsEnabled ? "bg-blue-50 border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  {alertsEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

            </div>

            {/* Save Buttons action footer */}
            <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3 mt-2 shrink-0 select-none">
              <button
                type="button"
                onClick={resetEntireModule}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-dark font-bold rounded-xl transition-colors"
              >
                Reset Default
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:opacity-90 active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </form>

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
                Empty Configuration Forms
              </button>
              <button
                onClick={() => setPageState("error")}
                className="px-2 py-1 rounded-md text-[9px] font-bold col-span-2 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200"
              >
                Simulate Settings Error
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
