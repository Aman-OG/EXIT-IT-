import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const baseClasses = 'animate-pulse bg-neutral-200 dark:bg-neutral-800';
  
  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-3 w-full mb-2',
    heading: 'rounded h-6 w-3/4 mb-4',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.rect} ${className}`} 
      {...props} 
    />
  );
};

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

export default Skeleton;
