
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { useEffect } from "react";
import { toast } from "sonner";

interface ErrorViewProps {
  message?: string;
  title?: string;
  status?: number;
  canRetry?: boolean;
}

export const ErrorView = ({ 
  message = "Something went wrong", 
  title = "Error",
  status,
  canRetry = true
}: ErrorViewProps) => {
  const navigate = useNavigate();
  
  // Log error for debugging
  useEffect(() => {
    console.error(`Error view rendered: ${status} - ${title} - ${message}`);
    
    // Show toast notification
    toast.error(message || "An error occurred");
  }, [status, title, message]);

  // Handle retry with cache clearing
  const handleRetry = () => {
    // Clear any potential cache-related issues
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
        console.log('Cleared cache before retrying');
      });
    }
    
    // Add a small delay to ensure cache clearing completes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-8 sm:py-16">
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-6 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-5 rounded-full">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            {status ? `${status} - ${title}` : title}
          </h2>
          <p className="text-muted-foreground max-w-md px-4 text-base">{message}</p>
          
          <div className="space-y-2 max-w-md">
            <p className="text-sm text-muted-foreground">
              This might be due to one of the following:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside text-left">
              <li>Internet connection issues</li>
              <li>Server is temporarily unavailable</li>
              <li>Map resources couldn't be loaded</li>
              <li>Your browser may be blocking certain resources</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            {canRetry && (
              <Button onClick={handleRetry} className="flex items-center gap-2 bg-primary">
                <RefreshCw className="h-4 w-4" />
                Try Again
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
