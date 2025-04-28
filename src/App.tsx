
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import MarketplaceHub from "@/pages/MarketplaceHub";
import { NetworkMonitorProvider } from "@/providers/NetworkMonitor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkMonitorProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MarketplaceHub />} />
            <Route path="/marketplace" element={<MarketplaceHub />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </NetworkMonitorProvider>
    </QueryClientProvider>
  );
}

export default App;
