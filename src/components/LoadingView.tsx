
import { PageLoader } from "./loaders/PageLoader";

export const LoadingView = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px]">
        <PageLoader 
          type="shimmer" 
          fullScreen={false} 
          className="h-[80vh]"
        />
      </div>
    </div>
  );
}
