import React from "react";

export default function FocusSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse w-full max-w-7xl mx-auto py-4 select-none">
      
      {/* 1. Left Timer Column */}
      <div className="flex-1 bg-white border border-border-main p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center gap-8 shadow-sm min-h-[500px]">
        {/* Title / Tab Selection Placeholder */}
        <div className="h-6 w-48 bg-slate-200 rounded-lg self-center" />
        
        {/* Big Shimmering Countdown Circular Ring */}
        <div className="relative h-64 w-64 rounded-full border-[12px] border-slate-100 flex items-center justify-center mt-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Buttons placeholders */}
        <div className="flex items-center gap-4 mt-2">
          <div className="h-12 w-32 bg-slate-200 rounded-xl" />
          <div className="h-12 w-12 bg-slate-200 rounded-xl" />
        </div>

        {/* Goal text input mockup placeholder */}
        <div className="w-full max-w-sm h-11 bg-slate-100 rounded-xl border border-slate-200/50 mt-4" />
      </div>

      {/* 2. Right Sidebar Stats & History Column */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Today's Focus Metrics mock card */}
        <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="h-5 w-32 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 border border-slate-100 rounded-xl flex flex-col gap-1 items-center justify-center">
              <div className="h-5 w-8 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>
            <div className="p-3 border border-slate-100 rounded-xl flex flex-col gap-1 items-center justify-center">
              <div className="h-5 w-12 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Session log history mock list */}
        <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-4 shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 bg-slate-200 rounded-lg" />
            <div className="h-4 w-8 bg-slate-200 rounded-full" />
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
                <div className="h-4 w-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
