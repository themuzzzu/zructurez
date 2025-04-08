
import { PageLoader } from "./loaders/PageLoader";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface LoadingViewProps {
  type?: 'default' | 'business' | 'service' | 'product';
  fullScreen?: boolean;
  className?: string;
}

export const LoadingView = ({ 
  type = 'default', 
  fullScreen = false,
  className = ''
}: LoadingViewProps) => {
  if (type === 'business') {
    return (
      <div className={`container max-w-[1400px] mx-auto px-4 py-8 ${className}`}>
        <Skeleton className="h-10 w-1/3 mb-6" /> {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === 'service') {
    return (
      <div className={`container max-w-[1400px] mx-auto px-4 py-8 ${className}`}>
        <Skeleton className="h-10 w-1/3 mb-6" /> {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${fullScreen ? 'min-h-screen' : ''} bg-background ${className}`}>
      <div className="container max-w-[1400px]">
        <PageLoader 
          type="shimmer" 
          fullScreen={fullScreen} 
          className={fullScreen ? "h-[80vh]" : ""}
        />
      </div>
    </div>
  );
};
