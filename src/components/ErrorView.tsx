
import { Button } from '@/components/ui/button';
import { WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '@/providers/NetworkMonitor';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: Error | null;
}

export function ErrorView({ 
  title = "Something went wrong", 
  message = "We couldn't load this content. Please try again later.", 
  onRetry, 
  error 
}: ErrorViewProps) {
  const { isOnline } = useNetworkStatus();
  
  // If we're offline, show the offline view
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background border rounded-lg">
        <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">You're offline</h2>
        <p className="text-muted-foreground mb-4">
          Please check your internet connection and try again.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-background border rounded-lg">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      {error && (
        <div className="bg-muted p-3 rounded mb-4 w-full max-w-lg overflow-auto text-left">
          <p className="text-sm font-mono">{error.message}</p>
        </div>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
