import { Loader2 } from "lucide-react";

export const LoadingView = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    </div>
  );
};