"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sparkles,
  Award,
  EyeOff,
  Eye,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  History,
  Volume2,
  VolumeX,
  X,
  Plus,
  Moon,
  ChevronRight,
  TrendingUp,
  Flame,
  Bug
} from "lucide-react";
import FocusSkeleton from "@/components/FocusSkeleton";

// Interfaces
interface FocusSession {
  id: string;
  date: string; // ISO string
  goal: string;
  duration: number; // in minutes
  completed: boolean;
  type: "Work" | "Short Break" | "Long Break";
}

interface FocusSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
}

export default function FocusPage() {
  // 4 States: "success" | "loading" | "empty" | "error"
  const [pageState, setPageState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true);

  // Focus Timer Configurations
  const [settings, setSettings] = useState<FocusSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true
  });

  // Current session configurations
  const [currentType, setCurrentType] = useState<"Work" | "Short Break" | "Long Break">("Work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionGoal, setSessionGoal] = useState("");
  const [isMinimal, setIsMinimal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings Edit inputs state
  const [editWork, setEditWork] = useState(25);
  const [editShort, setEditShort] = useState(5);
  const [editLong, setEditLong] = useState(15);
  const [editSound, setEditSound] = useState(true);

  // Focus Session History scope
  const [historyList, setHistoryList] = useState<FocusSession[]>([]);

  // Timer Ref for drift compensation
  const expectedTimeRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated initial async load & localStorage recovery
  useEffect(() => {
    // Restore settings
    try {
      const savedSettings = localStorage.getItem("thinkera_focus_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setEditWork(parsed.workDuration);
        setEditShort(parsed.shortBreakDuration);
        setEditLong(parsed.longBreakDuration);
        setEditSound(parsed.soundEnabled);
        
        // Initial time matches work duration
        setTimeLeft(parsed.workDuration * 60);
      } else {
        setTimeLeft(25 * 60);
      }

      // Restore history
      const savedHistory = localStorage.getItem("thinkera_focus_history");
      if (savedHistory) {
        setHistoryList(JSON.parse(savedHistory));
      } else {
        // Build mock historical entries for rich analytics immediately
        const mockHistory: FocusSession[] = [
          {
            id: "mock-1",
            date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            goal: "Mastered PostgreSQL Index structures",
            duration: 25,
            completed: true,
            type: "Work"
          },
          {
            id: "mock-2",
            date: new Date(Date.now() - 24 * 3600 * 1000 * 1.5).toISOString(),
            goal: "Arrays Practice on Two Sum & Valid Parentheses",
            duration: 45,
            completed: true,
            type: "Work"
          },
          {
            id: "mock-3",
            date: new Date(Date.now() - 24 * 3600 * 1000 * 2.5).toISOString(),
            goal: "Implemented Custom Queue in JS",
            duration: 25,
            completed: true,
            type: "Work"
          }
        ];
        setHistoryList(mockHistory);
        localStorage.setItem("thinkera_focus_history", JSON.stringify(mockHistory));
      }
    } catch (e) {
      console.error("Localstorage recovery failed", e);
    }

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  // Sync state variations
  useEffect(() => {
    if (pageState === "empty") {
      setHistoryList([]);
    } else if (pageState === "success") {
      try {
        const savedHistory = localStorage.getItem("thinkera_focus_history");
        if (savedHistory) {
          setHistoryList(JSON.parse(savedHistory));
        }
      } catch (e) {}
    }
  }, [pageState]);

  // Adjust timers if settings or active tab type changes
  useEffect(() => {
    if (!isRunning) {
      const mins =
        currentType === "Work"
          ? settings.workDuration
          : currentType === "Short Break"
          ? settings.shortBreakDuration
          : settings.longBreakDuration;
      setTimeLeft(mins * 60);
    }
  }, [currentType, settings]);

  // Web Audio synth alarm
  const playAlarmSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = "sine";
      // Arpeggio beep
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // E5
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      oscillator.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.24); // E6
      
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (err) {
      console.warn("Failed to play synthesized sound", err);
    }
  };

  // Safe timer loop using Timestamp calculations to compensate for background throttle
  useEffect(() => {
    if (isRunning) {
      expectedTimeRef.current = Date.now() + timeLeft * 1000;
      
      intervalIdRef.current = setInterval(() => {
        if (expectedTimeRef.current !== null) {
          const remaining = Math.round((expectedTimeRef.current - Date.now()) / 1000);
          
          if (remaining <= 0) {
            // Timer expired!
            handleTimerComplete();
          } else {
            setTimeLeft(remaining);
          }
        }
      }, 500); // Poll fast for smooth UX
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      expectedTimeRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning]);

  // Complete session logger
  const handleTimerComplete = () => {
    setIsRunning(false);
    playAlarmSound();

    const duration =
      currentType === "Work"
        ? settings.workDuration
        : currentType === "Short Break"
        ? settings.shortBreakDuration
        : settings.longBreakDuration;

    // Log focus session in history
    const newSession: FocusSession = {
      id: "focus-" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      goal: sessionGoal || (currentType === "Work" ? "Independent Focus Session" : `${currentType} Rest Period`),
      duration,
      completed: true,
      type: currentType
    };

    const updated = [newSession, ...historyList];
    setHistoryList(updated);
    if (pageState !== "empty") {
      localStorage.setItem("thinkera_focus_history", JSON.stringify(updated));
    }

    // Toggle automatically to Break after Work, or back to Work after Break
    if (currentType === "Work") {
      // 4th work session gets long break
      const completedWorkToday = updated.filter(
        (s) =>
          s.type === "Work" &&
          s.completed &&
          new Date(s.date).toDateString() === new Date().toDateString()
      ).length;

      if (completedWorkToday > 0 && completedWorkToday % 4 === 0) {
        setCurrentType("Long Break");
      } else {
        setCurrentType("Short Break");
      }
    } else {
      setCurrentType("Work");
    }
  };

  // Reset current timer state
  const resetTimer = () => {
    setIsRunning(false);
    const mins =
      currentType === "Work"
        ? settings.workDuration
        : currentType === "Short Break"
        ? settings.shortBreakDuration
        : settings.longBreakDuration;
    setTimeLeft(mins * 60);
  };

  // Formatter for MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Progress circle calculations
  const totalSeconds =
    currentType === "Work"
      ? settings.workDuration * 60
      : currentType === "Short Break"
      ? settings.shortBreakDuration * 60
      : settings.longBreakDuration * 60;

  const fractionCompleted = 1 - timeLeft / totalSeconds;
  const radius = 110;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - fractionCompleted * circumference;

  // Custom Settings save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bounds validation checks
    const workVal = Math.min(180, Math.max(1, editWork));
    const shortVal = Math.min(60, Math.max(1, editShort));
    const longVal = Math.min(120, Math.max(1, editLong));

    const newSettings: FocusSettings = {
      workDuration: workVal,
      shortBreakDuration: shortVal,
      longBreakDuration: longVal,
      soundEnabled: editSound
    };

    setSettings(newSettings);
    localStorage.setItem("thinkera_focus_settings", JSON.stringify(newSettings));
    setShowSettingsModal(false);
    
    // Reset timer to match newly edited work values if timer is inactive
    if (!isRunning) {
      const mins =
        currentType === "Work"
          ? workVal
          : currentType === "Short Break"
          ? shortVal
          : longVal;
      setTimeLeft(mins * 60);
    }
  };

  // Clear focus sessions logs
  const clearLogs = () => {
    setHistoryList([]);
    localStorage.removeItem("thinkera_focus_history");
  };

  // Recovery trigger for corrupted state
  const resetEntireModule = () => {
    localStorage.removeItem("thinkera_focus_settings");
    localStorage.removeItem("thinkera_focus_history");
    setSettings({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      soundEnabled: true
    });
    setEditWork(25);
    setEditShort(5);
    setEditLong(15);
    setEditSound(true);
    setCurrentType("Work");
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setSessionGoal("");
    setHistoryList([]);
    setPageState("success");
  };

  // Calculate high-fidelity stats for study panel
  const completedToday = historyList.filter(
    (s) =>
      s.type === "Work" &&
      s.completed &&
      new Date(s.date).toDateString() === new Date().toDateString()
  );
  
  const totalMinsToday = completedToday.reduce((acc, curr) => acc + curr.duration, 0);

  // Dynamic colors matching states
  const themeColors = {
    Work: {
      lightBg: "bg-blue-50/50",
      border: "border-blue-200",
      accent: "text-primary",
      gradient: "from-blue-600 to-indigo-600",
      ringGradient: ["#2563EB", "#3B82F6"]
    },
    "Short Break": {
      lightBg: "bg-emerald-50/50",
      border: "border-emerald-200",
      accent: "text-emerald-600",
      gradient: "from-emerald-600 to-teal-600",
      ringGradient: ["#059669", "#10B981"]
    },
    "Long Break": {
      lightBg: "bg-purple-50/50",
      border: "border-purple-200",
      accent: "text-purple-600",
      gradient: "from-purple-600 to-fuchsia-600",
      ringGradient: ["#7C3AED", "#8B5CF6"]
    }
  }[currentType];

  if (initialLoading || pageState === "loading") {
    return <FocusSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 w-full max-w-7xl mx-auto select-none relative min-h-[calc(100vh-120px)]">
      
      {/* ========================================================================= */}
      {/* IMmersive MINIMALIST DISTRACTION-FREE OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMinimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:32px_32px]"
          >
            {/* Glowing neon aura */}
            <div className={`absolute h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-10`} />

            {/* Top Toolbar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 tracking-widest flex items-center gap-1.5">
                <Moon className="h-4 w-4 animate-pulse" />
                <span>THINKERA DEEP FOCUS AMBIENT MODE</span>
              </span>
              <button
                onClick={() => setIsMinimal(false)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Exit Minimalist</span>
              </button>
            </div>

            {/* Center Content Ring */}
            <div className="flex flex-col items-center gap-8 max-w-md text-center">
              <span className={`text-[10px] font-black uppercase tracking-widest border border-indigo-900/50 px-3 py-1 rounded-full bg-indigo-950/40 ${themeColors.accent}`}>
                {currentType} Period
              </span>

              {/* Pulsing countdown timer display */}
              <div className="relative h-72 w-72 flex items-center justify-center">
                {/* SVG Countdown circle */}
                <svg width="280" height="280" className="transform -rotate-90">
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="transparent"
                    stroke="#1E293B"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="transparent"
                    stroke={currentType === "Work" ? "#3B82F6" : currentType === "Short Break" ? "#10B981" : "#8B5CF6"}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s linear" }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-6xl font-extrabold text-slate-50 tracking-tighter tabular-nums font-mono leading-none">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-2 tracking-wider">
                    {isRunning ? "Deep Studying..." : "Study Paused"}
                  </span>
                </div>
              </div>

              {/* Active Session Goal */}
              {sessionGoal ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Active Study Target:</span>
                  <p className="text-sm font-extrabold text-slate-200">{sessionGoal}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific goal configured. Focus on coding challenges.</p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`h-14 px-8 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all ${
                    isRunning
                      ? "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200"
                      : "bg-white hover:bg-slate-100 text-slate-950"
                  }`}
                >
                  {isRunning ? <Pause className="h-4.5 w-4.5 fill-current" /> : <Play className="h-4.5 w-4.5 fill-current" />}
                  <span>{isRunning ? "Pause Studying" : "Resume studying"}</span>
                </button>

                <button
                  onClick={resetTimer}
                  className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors shadow-lg"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ERROR FALLBACK STATE */}
      {/* ========================================================================= */}
      {pageState === "error" && (
        <div className="flex-1 bg-white border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[500px]">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-dark">Focus State Integrity Corruption</h3>
          <p className="text-xs text-muted-main max-w-xs leading-relaxed">
            We discovered abnormal drifts in your local storage session logs. To prevent progress sync conflicts, we recommend flushing the timer history.
          </p>
          <button
            onClick={resetEntireModule}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Flush Focus Logs & Reset</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS & BREAK STATE VIEW */}
      {/* ========================================================================= */}
      {pageState !== "error" && (
        <>
          {/* 1. Left Timer Card Module */}
          <div className="flex-grow bg-white border border-border-main p-6 md:p-8 rounded-2xl flex flex-col items-center gap-6 shadow-sm min-w-0 self-start">
            
            {/* Header selection tab options */}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-4 select-none shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="font-extrabold text-sm text-dark tracking-tight">Deep Pomodoro Focus Timer</h2>
              </div>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 border border-border-main hover:bg-slate-50 text-muted-main hover:text-dark rounded-xl transition-colors"
              >
                <Settings className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Timer Cycle Selector Tab Headers */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl w-full max-w-sm shrink-0">
              {(["Work", "Short Break", "Long Break"] as const).map((type) => {
                const active = currentType === type;
                return (
                  <button
                    key={type}
                    disabled={isRunning}
                    onClick={() => setCurrentType(type)}
                    className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black text-center transition-all ${
                      isRunning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    } ${
                      active
                        ? "bg-white text-dark shadow-xs border border-border-main/40 font-extrabold"
                        : "text-muted-main hover:text-dark"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Countdown Circular Ring Dashboard */}
            <div className="relative h-64 w-64 flex items-center justify-center shrink-0">
              
              {/* Outer circular gradient SVG ring */}
              <svg width="240" height="240" className="transform -rotate-90">
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="8"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={currentType === "Work" ? "#2563EB" : currentType === "Short Break" ? "#059669" : "#7C3AED"}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s linear" }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-dark tracking-tight leading-none tabular-nums font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider mt-2.5 ${themeColors.accent}`}>
                  {isRunning ? `${currentType} Active` : "Study Idle"}
                </span>
              </div>
            </div>

            {/* Quick Actions buttons */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`h-12 px-7 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-md transition-all bg-gradient-to-r hover:opacity-90 active:scale-95 ${themeColors.gradient}`}
              >
                {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{isRunning ? "Pause Session" : "Start Session"}</span>
              </button>

              <button
                onClick={resetTimer}
                className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-muted-main hover:text-dark flex items-center justify-center transition-colors shadow-xs"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsMinimal(true)}
                className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-muted-main hover:text-dark flex items-center justify-center transition-colors shadow-xs"
                title="Enter deep distraction-free ambient view"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>

            {/* Dynamic Goal text input */}
            <div className="w-full max-w-md flex flex-col gap-2 shrink-0 select-none">
              <span className="text-[10px] font-bold text-muted-main uppercase tracking-wider">Configure Active Study Target:</span>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <Sparkles className={`h-4.5 w-4.5 shrink-0 ${themeColors.accent}`} />
                <input
                  type="text"
                  placeholder="e.g. Solve 3 Array problems / Complete video lectures..."
                  value={sessionGoal}
                  onChange={(e) => setSessionGoal(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-2 text-xs font-semibold focus:outline-none bg-transparent text-dark placeholder-slate-400"
                />
                {sessionGoal && !isRunning && (
                  <button onClick={() => setSessionGoal("")} className="text-slate-400 hover:text-dark p-0.5">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* 2. Right Sidebar Stats & Session Logs History */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 select-none self-stretch">
            
            {/* Stats Metrics widgets */}
            <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-4 shadow-sm shrink-0">
              <h3 className="font-extrabold text-xs text-dark border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Today's Focus Metrics</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-bg-main border border-border-main/50 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-dark leading-none">{completedToday.length}</span>
                  <span className="text-[9px] text-muted-main font-bold mt-1 uppercase tracking-wider">Sessions</span>
                </div>
                <div className="p-3 bg-bg-main border border-border-main/50 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-dark leading-none">{totalMinsToday}</span>
                  <span className="text-[9px] text-muted-main font-bold mt-1 uppercase tracking-wider">Minutes</span>
                </div>
              </div>

              {/* Flame streak tracker integration */}
              <div className="bg-orange-50 border border-orange-200/50 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                    <Flame className="h-4.5 w-4.5 fill-current animate-bounce" style={{ animationDuration: "3s" }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-orange-800 font-extrabold leading-none">Focus Consistency</span>
                    <span className="text-[9px] text-orange-600 font-semibold mt-0.5">Maintain your daily target streak!</span>
                  </div>
                </div>
                <span className="text-xs font-black text-orange-700">14 Days</span>
              </div>
            </div>

            {/* Session log list history */}
            <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-4 shadow-sm flex-1 min-h-[300px]">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
                <h3 className="font-extrabold text-xs text-dark flex items-center gap-1.5">
                  <History className="h-4 w-4 text-emerald-600" />
                  <span>Session History Logs</span>
                </h3>
                {historyList.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="text-[9px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Logs Content scrollbox */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[360px] lg:max-h-none">
                {historyList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center gap-3 py-12 px-4 flex-grow my-auto">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-xs text-dark">Zero Study Sessions Logged</span>
                      <p className="text-[10px] text-muted-main leading-relaxed max-w-[180px] mx-auto">
                        Ready to level up? Start a Pomodoro study session to record logs.
                      </p>
                    </div>
                  </div>
                ) : (
                  historyList.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-bg-main border border-border-main/50 rounded-xl flex items-start justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <p className="text-[10px] font-extrabold text-dark leading-snug truncate">
                          {log.goal}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-main font-semibold">
                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            log.type === "Work"
                              ? "bg-blue-100 text-blue-800"
                              : log.type === "Short Break"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {log.type}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-800 shrink-0">
                        +{log.duration}m
                      </span>
                    </div>
                  ))
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
                Empty / Reset Logs View
              </button>
              <button
                onClick={() => setPageState("error")}
                className="px-2 py-1 rounded-md text-[9px] font-bold col-span-2 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200"
              >
                Simulate Crash / Error View
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CUSTOMIZABLE GLASSMORPHIC SETTINGS MODAL */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {showSettingsModal && (
              <>
                {/* Backdrop blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSettingsModal(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
                />

                {/* Settings Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="fixed inset-x-4 top-12 md:top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-96 bg-white border border-border-main z-50 shadow-2xl rounded-2xl p-6 select-none"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-dark flex items-center gap-1.5">
                      <Settings className="h-4.5 w-4.5 text-primary" />
                      <span>Pomodoro Configurations</span>
                    </h3>
                    <button
                      onClick={() => setShowSettingsModal(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-dark transition-colors"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 mt-4 text-xs">
                    
                    {/* Work Duration limits */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Work Session Duration (Minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={editWork}
                        onChange={(e) => setEditWork(parseInt(e.target.value) || 25)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold font-mono"
                      />
                    </div>

                    {/* Short Break Duration limits */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Short Break Duration (Minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editShort}
                        onChange={(e) => setEditShort(parseInt(e.target.value) || 5)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold font-mono"
                      />
                    </div>

                    {/* Long Break Duration limits */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600">Long Break Duration (Minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={editLong}
                        onChange={(e) => setEditLong(parseInt(e.target.value) || 15)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-dark font-semibold font-mono"
                      />
                    </div>

                    {/* Sound Alert Toggle */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 select-none">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">Synthesized Sound Alerts</span>
                        <span className="text-[10px] text-muted-main">Beeps arpeggio tones when timers expire</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setEditSound(!editSound)}
                        className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-colors ${
                          editSound ? "bg-blue-50 border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        {editSound ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
                      </button>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowSettingsModal(false)}
                        className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-dark font-bold rounded-xl transition-colors text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all text-center"
                      >
                        Save Preferences
                      </button>
                    </div>

                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
}
