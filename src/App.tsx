
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { userRoutes } from "@/routes/userRoutes";
import { marketplaceRoutes } from "@/routes/marketplaceRoutes";
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
            {/* Include user routes */}
            {userRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            {/* Include marketplace routes */}
            {marketplaceRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
                errorElement={route.errorElement}
              />
            ))}
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </NetworkMonitorProvider>
    </QueryClientProvider>
  );
}

export default App;
