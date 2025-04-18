
import { Suspense, ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback || (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )}>
      {children}
    </Suspense>
  );
}
