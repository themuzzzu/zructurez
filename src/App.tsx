
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
          // Dynamically import Capacitor plugins only when needed
          const capacitorModules = await Promise.allSettled([
            import('@capacitor/splash-screen'),
            import('@capacitor/status-bar'),
            import('@capacitor/app')
          ]);
          
          // Hide splash screen
          const splashScreenModule = capacitorModules[0];
          if (splashScreenModule.status === 'fulfilled') {
            await splashScreenModule.value.SplashScreen.hide();
          }
          
          // Set status bar style
          const statusBarModule = capacitorModules[1];
          if (statusBarModule.status === 'fulfilled') {
            const { StatusBar, Style } = statusBarModule.value;
            await StatusBar.setStyle({ style: Style.Default });
          }
          
          // Handle back button on Android
          const appModule = capacitorModules[2];
          if (appModule.status === 'fulfilled') {
            const { App: CapApp } = appModule.value;
            CapApp.addListener('backButton', ({ canGoBack }) => {
              if (!canGoBack) {
                CapApp.exitApp();
              } else {
                window.history.back();
              }
            });
          }
          
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
