import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-3 w-full mb-2',
    heading: 'rounded h-6 w-3/4 mb-4',
  };

  return (
    <div 
      className={`skeleton-base ${variantClasses[variant] || variantClasses.rect} ${className}`} 
      {...props} 
    />
  );
};

export const StatSkeleton = () => (
  <div className="group bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center space-x-5">
    <Skeleton className="w-16 h-16 rounded-xl" />
    <div className="flex-1">
      <Skeleton variant="text" className="w-24 mb-2" />
      <Skeleton className="w-32 h-8" />
    </div>
  </div>
);

export const CourseSkeleton = () => (
  <div className="bg-card rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 h-[280px] flex flex-col">
    <div className="flex items-start space-x-3.5 mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="heading" className="w-full" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    </div>
    <div className="space-y-3 mt-auto">
      <Skeleton className="h-2 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const QuizSkeleton = () => (
  <div className="w-full flex items-center justify-between p-4 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl">
    <div className="flex items-center space-x-3 flex-1">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-2 w-24" />
      </div>
    </div>
    <Skeleton className="w-20 h-8 rounded-lg" />
  </div>
);

export const StudySkeleton = () => (
  <div className="flex flex-col items-center p-8 w-full max-w-4xl mx-auto space-y-8">
    <div className="w-full space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <div className="w-full bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl p-10 h-[800px] space-y-6">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="pt-10 space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="pt-10 space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
    </div>
  </div>
);

export const ResumeSkeleton = () => (
  <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-14 flex flex-col items-center justify-center min-h-[350px]">
    <Skeleton className="w-20 h-20 rounded-full mb-5" />
    <Skeleton className="h-8 w-48 mb-6" />
    <Skeleton className="h-4 w-full max-w-md mb-6" />
    <Skeleton className="h-12 w-40 rounded-xl" />
  </div>
);

export const ExamCardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
  </div>
);

export const MaterialCardSkeleton = () => (
  <div className="bg-background rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col items-center text-center space-y-3">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="w-full space-y-2">
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
    </div>
    <Skeleton className="h-8 w-full rounded-xl" />
  </div>
);

export const QuizCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20 rounded" />
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  </div>
);

export const FlashcardDeckSkeleton = () => (
  <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[170px] space-y-4">
    <div>
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-4/5 mb-2" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

export const CourseAccordionSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-card">
    <div className="w-full p-4 sm:p-6 flex items-center gap-4">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2.5 min-w-0">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full shrink-0" />
      <Skeleton className="h-5 w-5 rounded-lg shrink-0" />
    </div>
  </div>
);

export const NoteCardSkeleton = () => (
  <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm flex flex-col h-[280px]">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <div className="space-y-1 text-right flex flex-col items-end">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-2.5 w-12" />
      </div>
    </div>
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2 mb-3" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
      <Skeleton className="h-7 w-28 rounded-lg" />
      <Skeleton className="h-6 w-6 rounded-lg" />
    </div>
  </div>
);

export const RoadmapSkeleton = () => (
  <div className="space-y-8">
    {/* Progress card */}
    <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="flex items-center space-x-6 shrink-0">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-3 bg-neutral-100/50 dark:bg-neutral-800/30 rounded-xl space-y-1.5 border border-neutral-200/50 dark:border-neutral-800/50">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      </div>
    </div>

    {/* Recommended Card */}
    <div className="bg-card/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-4 flex-1 w-full">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-11 w-36 rounded-xl shrink-0" />
    </div>

    {/* Course Grid */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-60 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LeaderboardSkeleton = () => (
  <div className="w-full flex flex-col bg-background pb-8">
    {/* Hero section */}
    <div className="border-b border-neutral-200 dark:border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <Skeleton className="w-14 h-14 rounded-2xl mx-auto lg:mx-0" />
          <Skeleton className="h-10 w-64 mx-auto lg:mx-0" />
          <Skeleton className="h-4 w-full max-w-md mx-auto lg:mx-0" />
          <Skeleton className="h-4 w-3/4 max-w-sm mx-auto lg:mx-0" />
        </div>
        {/* Podium Skeleton */}
        <div className="flex-1 flex justify-center items-end gap-3 w-full max-w-md">
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-20 h-24 rounded-t-2xl" />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="w-24 h-32 rounded-t-2xl" />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-20 h-16 rounded-t-2xl" />
          </div>
        </div>
      </div>
    </div>
    {/* Rows */}
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-8 space-y-3">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export const FriendCardSkeleton = () => (
  <div className="bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-center gap-3.5 flex-1 min-w-0">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-2.5 w-24" />
      </div>
    </div>
    <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-8 max-w-7xl mx-auto w-full">
    {/* Hero banner */}
    <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-8 md:p-12 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Skeleton className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] shrink-0" />
        <div className="flex-1 space-y-3 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <Skeleton className="h-9 w-52 mx-auto md:mx-0" />
            <Skeleton className="h-6 w-32 rounded-full mx-auto md:mx-0" />
          </div>
          <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
          <Skeleton className="h-16 w-full max-w-xl rounded-xl mx-auto md:mx-0" />
        </div>
      </div>
    </div>

    {/* Key Stats Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>

    {/* Charts & Analytics Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>

    {/* Badges Grid */}
    <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex flex-col items-center text-center space-y-2">
            <Skeleton className="w-14 h-14 rounded-2xl mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-2.5 w-32 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
