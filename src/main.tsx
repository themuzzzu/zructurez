
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set initial theme based on saved preference or system preference
const setInitialTheme = () => {
  const storedTheme = localStorage.getItem('app-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    document.documentElement.classList.add(storedTheme);
  } else {
    // Check system preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
  }
};

// Run before rendering to prevent flash
setInitialTheme();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
