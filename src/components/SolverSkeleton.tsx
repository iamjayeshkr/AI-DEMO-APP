import React from "react";

export default function SolverSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse w-full h-[calc(100vh-120px)] select-none">
      
      {/* Top Header Placeholder */}
      <div className="bg-white border border-border-main p-4 rounded-xl flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-slate-200 rounded-lg" />
          <div className="h-8 w-20 bg-slate-200 rounded-lg" />
          <div className="h-8 w-20 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 3-Panel Split Grid Placeholder */}
      <div className="flex-grow flex gap-4 h-full min-h-0 overflow-hidden">
        
        {/* Left Pane (Description 35%) */}
        <div className="w-[35%] bg-white border border-border-main p-5 rounded-xl flex flex-col gap-4 shadow-sm h-full overflow-hidden shrink-0">
          <div className="h-5 w-24 bg-slate-200 rounded" />
          <div className="flex flex-col gap-2.5 mt-2">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-[85%] bg-slate-200 rounded" />
          </div>
          <div className="h-32 w-full bg-slate-50 border border-slate-100 rounded-xl mt-4" />
        </div>

        {/* Center Pane (Monaco Editor 40%) */}
        <div className="w-[40%] bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 shadow-sm h-full overflow-hidden shrink-0">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <div className="h-4 w-16 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800 rounded" />
          </div>
          <div className="flex-1 flex flex-col gap-2 mt-2 font-mono">
            <div className="h-4 w-40 bg-slate-800 rounded" />
            <div className="h-4 w-60 bg-slate-800 rounded" />
            <div className="h-4 w-32 bg-slate-800 rounded" />
          </div>
          <div className="flex justify-between border-t border-slate-800 pt-3.5 mt-auto">
            <div className="h-9 w-24 bg-slate-800 rounded-lg" />
            <div className="h-9 w-24 bg-slate-800 rounded-lg" />
          </div>
        </div>

        {/* Right Pane (AI & Results 25%) */}
        <div className="w-[25%] bg-white border border-border-main p-5 rounded-xl flex flex-col justify-between shadow-sm h-full overflow-hidden shrink-0">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-200 rounded" />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-[90%] bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 border border-slate-200/50 rounded-xl" />
            </div>
          </div>
          <div className="h-10 w-full bg-slate-200 rounded-lg mt-auto" />
        </div>

      </div>

    </div>
  );
}
