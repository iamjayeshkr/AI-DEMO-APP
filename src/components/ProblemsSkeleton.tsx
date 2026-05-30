import React from "react";

export default function ProblemsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full max-w-7xl mx-auto py-4">
      
      {/* Stats Bar Skeleton */}
      <div className="bg-white border border-border-main p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-44 bg-slate-200 rounded" />
        </div>
        <div className="flex-grow max-w-md w-full flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 w-full bg-slate-100 rounded-full" />
          </div>
          <div className="h-5 w-24 bg-slate-200 rounded-full shrink-0" />
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="h-8 w-20 bg-slate-200 rounded-full" />
          <div className="h-8 w-20 bg-slate-200 rounded-full" />
          <div className="h-8 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white border border-border-main p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="h-10 w-full md:w-80 bg-slate-200 rounded-xl" />
        <div className="h-10 w-full md:w-48 bg-slate-200 rounded-xl" />
        <div className="h-10 w-full md:w-40 bg-slate-200 rounded-xl" />
        <div className="h-10 w-full md:w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Tabular Grid Skeleton */}
      <div className="bg-white border border-border-main rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header Placeholder */}
        <div className="bg-slate-50 border-b border-border-main p-4 grid grid-cols-12 gap-4">
          <div className="col-span-1 h-4 w-6 bg-slate-200 rounded" />
          <div className="col-span-4 h-4 w-32 bg-slate-200 rounded" />
          <div className="col-span-2 h-4 w-20 bg-slate-200 rounded" />
          <div className="col-span-2 h-4 w-16 bg-slate-200 rounded" />
          <div className="col-span-1 h-4 w-16 bg-slate-200 rounded" />
          <div className="col-span-2 h-4 w-20 bg-slate-200 rounded" />
        </div>

        {/* Table Body Placeholders */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 h-4 w-6 bg-slate-200 rounded" />
              <div className="col-span-4 h-4 w-48 bg-slate-200 rounded" />
              <div className="col-span-2 h-5 w-16 bg-slate-200 rounded-full" />
              <div className="col-span-2 h-5 w-16 bg-slate-200 rounded-full" />
              <div className="col-span-1 h-4 w-12 bg-slate-200 rounded" />
              <div className="col-span-2 h-4 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
