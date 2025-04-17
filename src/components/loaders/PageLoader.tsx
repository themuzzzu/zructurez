
import React from 'react';

interface PageLoaderProps {
  type?: 'spinner' | 'shimmer';
  fullScreen?: boolean;
  className?: string;
}

export const PageLoader = ({ type = 'spinner', fullScreen = false, className = '' }: PageLoaderProps) => {
  const containerClass = `${fullScreen ? 'w-full h-screen' : 'w-full h-full'} flex items-center justify-center bg-background ${className}`;

  if (type === 'shimmer') {
    return (
      <div className={containerClass}>
        <div className="w-48 h-48 rounded-md bg-muted/20 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};
