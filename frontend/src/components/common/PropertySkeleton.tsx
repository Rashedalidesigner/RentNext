import React from 'react';

export const PropertySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden animate-pulse">
      {/* Media skeleton */}
      <div className="aspect-[4/3] bg-slate-200" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-28 bg-slate-200 rounded-md" />
          <div className="h-4 w-12 bg-slate-200 rounded-md" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
        <div className="pt-3 border-t border-slate-100 flex justify-between">
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};
