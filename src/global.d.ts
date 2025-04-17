
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    }
  }

  // Make React available globally for JSX
  const React: typeof import('react');
}

// This ensures React is properly defined globally
import React from 'react';
import ReactDOM from 'react-dom/client';

declare global {
  // Redefine React in global scope more explicitly
  const React: typeof React;
  const ReactDOM: typeof ReactDOM;
}

export {};
