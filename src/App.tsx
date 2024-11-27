import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Services from "./pages/Services";
import Groups from "./pages/Groups";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/events" element={<Events />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/maps" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;