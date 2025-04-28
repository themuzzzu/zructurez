
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { verifyVite } from "./utils/verifyVite";

// Verify Vite is working
verifyVite();

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found in the DOM.');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
