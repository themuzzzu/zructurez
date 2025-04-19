
import { Spinner } from '@/components/common/Spinner';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface LoadingViewProps {
  message?: string;
  showProgress?: boolean;
}

export function LoadingView({ message = "Loading...", showProgress = true }: LoadingViewProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <Spinner size="lg" className="mb-4" />
      <p className="text-center text-muted-foreground mb-2">{message}</p>
      {showProgress && (
        <div className="w-full max-w-xs">
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );
}
