
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import Index from "@/pages/Index";
import MapView from "@/pages/MapView";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/maps" element={<MapView />} />
              {/* Add other routes as needed */}
            </Routes>
            <LocationModalHandler />
            <Toaster position="top-center" />
          </Router>
        </LocationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
