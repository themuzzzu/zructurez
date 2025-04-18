
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ErrorViewProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
  title?: string;
  status?: number;
  canRetry?: boolean;
}

export const ErrorView = ({ 
  error,
  resetErrorBoundary,
  message = "Something went wrong", 
  title = "Error",
  status,
  canRetry = true
}: ErrorViewProps) => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  
  const errorMessage = error?.message || message;
  const errorTitle = error?.name || title;
  
  // Log error for debugging
  useEffect(() => {
    console.error(`Error view rendered:`, error || `${status} - ${title} - ${message}`);
    
    // Show toast notification
    toast.error(errorMessage || "An error occurred");
  }, [error, status, title, message, errorMessage]);

  // Handle retry with cache clearing
  const handleRetry = () => {
    // Prevent multiple rapid clicks
    if (isClearing) return;
    
    setIsClearing(true);
    setRetryCount(prev => prev + 1);
    
    // Show toast notification
    toast.loading("Clearing cache and reloading...");
    
    // Clear any potential cache-related issues
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
        console.log('Cleared cache before retrying');
        
        // For persistent errors, try more aggressive cache clearing
        if (retryCount > 1) {
          // Clear localStorage cache keys
          const cacheKeys = Object.keys(localStorage).filter(
            key => key.includes('cache') || key.includes('map')
          );
          cacheKeys.forEach(key => localStorage.removeItem(key));
          console.log('Cleared localStorage cache keys');
        }
        
        // Reset error boundary if provided
        if (resetErrorBoundary) {
          setTimeout(() => {
            resetErrorBoundary();
            setIsClearing(false);
          }, 300);
        } else {
          // Add a small delay to ensure cache clearing completes
          setTimeout(() => {
            window.location.reload();
          }, retryCount > 1 ? 500 : 200);
        }
      }).catch(err => {
        console.error('Error clearing cache:', err);
        // Reset or reload anyway
        if (resetErrorBoundary) {
          resetErrorBoundary();
        } else {
          window.location.reload();
        }
        setIsClearing(false);
      });
    } else {
      // If caches API is not available
      if (resetErrorBoundary) {
        resetErrorBoundary();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      setIsClearing(false);
    }
  };

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-8 sm:py-16">
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-6 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-5 rounded-full">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            {status ? `${status} - ${errorTitle}` : errorTitle}
          </h2>
          <p className="text-muted-foreground max-w-md px-4 text-base">{errorMessage}</p>
          
          {error && (
            <div className="bg-muted/30 p-4 rounded-md max-w-md overflow-auto text-left mx-4">
              <code className="text-xs text-muted-foreground whitespace-pre-wrap">
                {error.stack}
              </code>
            </div>
          )}
          
          <div className="space-y-2 max-w-md">
            <p className="text-sm text-muted-foreground">
              This might be due to one of the following:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside text-left">
              <li>Internet connection issues</li>
              <li>Server is temporarily unavailable</li>
              <li>The page resources couldn't be loaded</li>
              <li>Your browser may be blocking certain resources</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            {canRetry && (
              <Button 
                onClick={handleRetry} 
                className="flex items-center gap-2 bg-primary"
                disabled={isClearing}
              >
                <RefreshCw className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
                {isClearing ? 'Reloading...' : 'Try Again'}
              </Button>
            )}
            
            <Link to="/">
              <Button variant="secondary" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
