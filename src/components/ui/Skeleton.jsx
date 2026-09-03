import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-paper-200 rounded ${className}`} />
  );
};

export const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-paper-200 p-4 flex flex-col space-y-3">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};
