
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { verifyVite } from "./utils/verifyVite";

// Verify Vite is working
verifyVite();

// We don't need to wrap with providers here since they are already in App.tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
