
import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorView: React.FC = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-destructive">Oops! Something went wrong</h1>
      <p className="mt-2 text-center text-gray-600">
        {error?.statusText || error?.message || 'Sorry, an unexpected error has occurred.'}
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Go Home
      </button>
    </div>
  );
};
