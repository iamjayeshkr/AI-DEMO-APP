import React from "react";

export default function CommunitySkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse w-full max-w-7xl mx-auto py-4 select-none">
      
      {/* 1. Sidebar Shimmer Navigation (Collapses on Mobile) */}
      <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        
        {/* Shivering sidebar categories list */}
        <div className="flex flex-col gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-4.5 w-4.5 rounded bg-slate-200" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-6 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* Shivering active poster CTA representation */}
        <div className="h-10 w-full bg-slate-200 rounded-xl mt-2" />
      </div>

      {/* 2. Main Stream Column */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Top filter dashboard shimmer */}
        <div className="bg-white border border-border-main p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="h-9 w-full sm:max-w-xs bg-slate-200 rounded-xl" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="h-9 w-24 bg-slate-200 rounded-xl flex-1 sm:flex-none" />
            <div className="h-9 w-24 bg-slate-200 rounded-xl flex-1 sm:flex-none" />
          </div>
        </div>

        {/* Shivering Card list feed items */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-2.5 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-5 w-[85%] bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                <div className="flex gap-2">
                  <div className="h-6 w-12 bg-slate-100 rounded-md" />
                  <div className="h-6 w-12 bg-slate-100 rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
