
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface FeedErrorProps {
  onRetry: () => void;
}

export const FeedError: React.FC<FeedErrorProps> = ({ onRetry }) => {
  return (
    <div className="text-center p-8 space-y-4">
      <div className="flex justify-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold">Failed to Load Feed</h3>
      <p className="text-muted-foreground">
        There was a problem loading your feed. Please try again.
      </p>
      <Button onClick={onRetry} className="mt-4">
        Retry
      </Button>
    </div>
  );
};
