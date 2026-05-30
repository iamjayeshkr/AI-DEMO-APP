import React from "react";

export default function RoadmapSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse w-full h-[calc(100vh-100px)] py-4 select-none">
      
      {/* Sidebar stats panel skeleton */}
      <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="flex flex-col gap-4 mt-2">
          {/* Progress Ring mock */}
          <div className="flex justify-center py-4 border-b border-slate-50 pb-4">
            <div className="h-28 w-28 rounded-full border-8 border-slate-100 flex items-center justify-center" />
          </div>
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-[75%] bg-slate-200 rounded" />
        </div>
      </div>

      {/* Main Canvas grid skeleton */}
      <div className="flex-1 bg-white border border-border-main rounded-2xl shadow-sm h-full relative overflow-hidden flex flex-col p-6 gap-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="h-8 w-36 bg-slate-200 rounded-lg" />
        </div>
        
        {/* Shimmering canvas dots grid representation */}
        <div className="flex-1 bg-slate-50/50 rounded-xl relative border border-slate-100/50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="flex flex-col gap-8 items-center z-10">
            <div className="h-12 w-32 bg-slate-200 rounded-xl shadow-xs" />
            <div className="flex gap-16">
              <div className="h-12 w-32 bg-slate-200 rounded-xl shadow-xs" />
              <div className="h-12 w-32 bg-slate-200 rounded-xl shadow-xs" />
            </div>
            <div className="h-12 w-32 bg-slate-200 rounded-xl shadow-xs" />
          </div>
        </div>
      </div>

    </div>
  );
}
