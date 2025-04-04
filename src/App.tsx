
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { SecurityProvider } from '@/components/security/SecurityProvider';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="zructures-theme">
          <SecurityProvider>
            <RouterProvider router={router} />
            <Toaster />
          </SecurityProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
