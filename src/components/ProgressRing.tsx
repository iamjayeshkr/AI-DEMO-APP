"use"
"use client";

import React, { useEffect, useState } from "react";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  percentage,
  size = 140,
  strokeWidth = 10
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Trigger progress fill after mount for the 750ms ease-out visual effect
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      
      {/* SVG Container */}
      <svg width={size} height={size} className="transform -rotate-90">
        
        {/* Gradients */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" /> {/* Blue */}
            <stop offset="100%" stopColor="#059669" /> {/* Emerald */}
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 750ms cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </svg>

      {/* Centered Percentage Typography */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold text-dark tracking-tight leading-none">
          {percentage}%
        </span>
        <span className="text-[10px] font-bold text-muted-main uppercase tracking-wider mt-1">
          Complete
        </span>
      </div>

    </div>
  );
}
