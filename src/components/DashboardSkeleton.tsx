import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse w-full max-w-7xl mx-auto py-4">
      {/* Welcome Banner Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-main pb-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-48 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-full" />
      </div>

      {/* 3-Column Responsive Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Roadmap Progress Skeleton */}
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm h-80">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {/* Circle representation */}
            <div className="h-32 w-32 rounded-full border-[10px] border-slate-100 flex items-center justify-center" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Widget 2: Today's Problems Skeleton */}
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm h-80">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="h-4 w-12 bg-slate-200 rounded-full" />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3.5 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: Recent Activity Skeleton */}
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col gap-4 shadow-sm h-80">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="flex flex-col gap-4 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-200 flex-shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-3.5 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Continue Learning + Focus Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Continue Learning Skeleton (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-border-main p-6 rounded-2xl flex flex-col justify-between shadow-sm h-64">
          <div className="flex flex-col gap-3">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-6 w-80 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <div className="flex-1">
              <div className="h-2 w-full bg-slate-200 rounded-full" />
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* Focus Stats Skeleton */}
        <div className="bg-white border border-border-main p-6 rounded-2xl flex flex-col justify-between shadow-sm h-64">
          <div className="flex flex-col gap-3">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-3 border border-slate-100 rounded-xl flex flex-col gap-1 items-center">
                <div className="h-6 w-10 bg-slate-200 rounded" />
                <div className="h-3.5 w-16 bg-slate-200 rounded" />
              </div>
              <div className="p-3 border border-slate-100 rounded-xl flex flex-col gap-1 items-center">
                <div className="h-6 w-10 bg-slate-200 rounded" />
                <div className="h-3.5 w-16 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
          <div className="h-10 w-full bg-slate-200 rounded-lg" />
        </div>

      </div>
    </div>
  );
}
