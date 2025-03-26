
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
  
  // Apply stored font size
  const storedFontSize = localStorage.getItem("appFontSize");
  if (storedFontSize) {
    document.documentElement.style.fontSize = `${storedFontSize}%`;
  }
  
  // Apply stored UI color
  const storedUiColor = localStorage.getItem("appUiColor");
  if (storedUiColor && storedUiColor !== 'default') {
    document.documentElement.classList.add(`ui-${storedUiColor}`);
  }
};

// Add CSS variables for UI colors to the document
const addUiColorStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --primary: 221.2 83.2% 53.3%;
      --primary-foreground: 210 40% 98%;
    }
    
    .ui-purple {
      --primary: 271 81% 75%;
      --primary-foreground: 0 0% 100%;
    }
    .ui-red {
      --primary: 359 84% 58%;
      --primary-foreground: 0 0% 100%;
    }
    .ui-yellow {
      --primary: 43 96% 58%;
      --primary-foreground: 0 0% 0%;
    }
    
    .dark {
      --primary: 217.2 91.2% 59.8%;
      --primary-foreground: 222.2 47.4% 11.2%;
    }
    
    .dark.ui-purple {
      --primary: 271 81% 65%;
      --primary-foreground: 0 0% 100%;
    }
    .dark.ui-red {
      --primary: 359 84% 48%;
      --primary-foreground: 0 0% 100%;
    }
    .dark.ui-yellow {
      --primary: 43 96% 53%;
      --primary-foreground: 0 0% 0%;
    }
  `;
  document.head.appendChild(style);
};

// Enhanced error handlers for React
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the error from breaking the entire app
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Prevent the error from breaking the entire app
  event.preventDefault();
});

// Run before rendering to prevent flash
setInitialTheme();
addUiColorStyles();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
