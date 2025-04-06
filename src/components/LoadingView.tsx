
import { useEffect, useState } from "react";
import { PageLoader } from "./loaders/PageLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface LoadingViewProps {
  type?: "shimmer" | "dots" | "pulse";
  fullScreen?: boolean;
  className?: string;
  text?: string;
  timeout?: number;
}

export const LoadingView = ({
  type = "shimmer",
  fullScreen = true,
  className,
  text = "Loading...",
  timeout = 15000, // 15 second timeout
}: LoadingViewProps) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  if (isTimedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Loading took too long</AlertTitle>
            <AlertDescription>
              There seems to be an issue loading this content. Please try refreshing the page.
            </AlertDescription>
          </Alert>
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${fullScreen ? "min-h-screen bg-background" : ""}`}>
      <PageLoader
        type={type}
        fullScreen={false}
        className={className}
        text={text}
      />
    </div>
  );
};
