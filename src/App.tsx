
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MarketplaceHub from '@/pages/MarketplaceHub';
import { AuthProvider } from '@/hooks/useAuth';
import { userRoutes } from '@/routes/userRoutes';
import { isNativePlatform } from '@/utils/capacitor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize mobile-specific features
    const initializeMobile = async () => {
      if (isNativePlatform()) {
        try {
          // Hide splash screen after app loads
          const { SplashScreen } = await import('@capacitor/splash-screen');
          await SplashScreen.hide();
          
          // Set status bar style
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          await StatusBar.setStyle({ style: Style.Default });
          
          // Handle back button on Android
          const { App: CapApp } = await import('@capacitor/app');
          CapApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              CapApp.exitApp();
            } else {
              window.history.back();
            }
          });
          
          console.log('Mobile features initialized');
        } catch (error) {
          console.error('Error initializing mobile features:', error);
        }
      }
    };

    initializeMobile();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MarketplaceHub />} />
            <Route path="/marketplace" element={<MarketplaceHub />} />
            {userRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
          <Toaster position="top-right" richColors />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
