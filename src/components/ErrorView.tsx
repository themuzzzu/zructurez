
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorViewProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  onRetry?: () => void;
  message?: string;
}

export const ErrorView = ({ error, resetErrorBoundary, onRetry, message }: ErrorViewProps) => {
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">
        {message || "We encountered an error while loading the data. Please try again."}
      </p>
      <Button onClick={handleRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};
