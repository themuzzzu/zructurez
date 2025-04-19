
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { verifyVite } from "./utils/verifyVite";

// Verify Vite is working
verifyVite();

// Check if DOM is ready
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found. Creating one...");
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
  
  ReactDOM.createRoot(newRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
