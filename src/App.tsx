
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MarketplaceHub from '@/pages/MarketplaceHub';
import { NetworkMonitorProvider } from '@/providers/NetworkMonitorProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkMonitorProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MarketplaceHub />} />
            <Route path="/marketplace" element={<MarketplaceHub />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </Router>
      </NetworkMonitorProvider>
    </QueryClientProvider>
  );
}

export default App;
