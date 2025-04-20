
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Business Directory</h1>
        <p>Setup successful! Your application is now configured correctly.</p>
      </div>
    </React.StrictMode>
  );
}
