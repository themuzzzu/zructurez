
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <LanguageProvider>
        <App />
        <Toaster position="top-center" />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
