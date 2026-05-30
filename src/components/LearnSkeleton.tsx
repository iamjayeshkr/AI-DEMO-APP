import React from "react";

export default function LearnSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse w-full max-w-7xl mx-auto py-4">
      
      {/* Sidebar Skeleton (Collapses to dropdown on mobile) */}
      <div className="w-full lg:w-64 bg-white border border-border-main p-5 rounded-2xl flex flex-col gap-6 shadow-sm self-start shrink-0">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((section) => (
            <div key={section} className="flex flex-col gap-2">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="flex flex-col gap-1.5 ml-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-4.5 w-8 bg-slate-200 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Topic Header Skeleton */}
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <div className="h-4.5 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-80 bg-slate-200 rounded-lg mt-1" />
          </div>
          <div className="h-4 w-full bg-slate-200 rounded mt-1" />
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-12 bg-slate-200 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden" />
          </div>
        </div>

        {/* 2x2 Resource Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-border-main p-6 rounded-2xl shadow-sm h-48 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg mt-2 self-start" />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
