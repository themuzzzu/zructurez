
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
}

// This ensures React is properly defined globally
import React from 'react';
import ReactDOM from 'react-dom/client';

declare global {
  const React: typeof React;
  const ReactDOM: typeof ReactDOM;
}

export {};
