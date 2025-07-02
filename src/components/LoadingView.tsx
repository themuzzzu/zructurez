
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};
