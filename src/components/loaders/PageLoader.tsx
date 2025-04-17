
import React from 'react';

interface PageLoaderProps {
  type?: 'spinner' | 'shimmer';
}

export const PageLoader = ({ type = 'spinner' }: PageLoaderProps) => {
  if (type === 'shimmer') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="w-48 h-48 rounded-md bg-muted/20 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};
