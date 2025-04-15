
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <Routes />
          <LocationModalHandler />
          <Toaster position="top-center" />
        </LocationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
