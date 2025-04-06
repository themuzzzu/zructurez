
import { useState, useEffect } from "react";
import { PageLoader } from "./loaders/PageLoader";
import { useLoading } from "@/providers/LoadingProvider";
import { ProgressLoader } from "./loaders/ProgressLoader";

interface LoadingViewProps {
  section?: "general" | "marketplace" | "business" | "profile" | "messages" | "community";
  showProgress?: boolean;
}

export const LoadingView = ({ 
  section = "general",
  showProgress = true
}: LoadingViewProps) => {
  const [loaderType, setLoaderType] = useState<"bouncing" | "rangoli">("rangoli");
  const [iconTypes, setIconTypes] = useState<("auto" | "dosa" | "coconut" | "dot")[]>(["dot", "dot", "dot"]);
  const { progress } = useLoading();

  // Set loader type based on section
  useEffect(() => {
    // Choose loader type and icons based on section
    switch(section) {
      case "marketplace":
        setLoaderType("bouncing");
        setIconTypes(["auto", "coconut", "auto"]);
        break;
      case "business":
        setLoaderType("rangoli");
        break;
      case "profile":
        setLoaderType("bouncing");
        setIconTypes(["dot", "dot", "dot"]);
        break;
      case "messages":
        setLoaderType("bouncing");
        setIconTypes(["dot", "dot", "dot"]);
        break;
      case "community":
        setLoaderType("rangoli");
        break;
      default:
        // Randomly choose for general sections
        setLoaderType(Math.random() > 0.5 ? "rangoli" : "bouncing");
        setIconTypes(Math.random() > 0.5 ? ["auto", "dosa", "coconut"] : ["dot", "dot", "dot"]);
    }
  }, [section]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px]">
        {showProgress && <ProgressLoader fixed />}
        
        <PageLoader 
          type={loaderType} 
          iconType={iconTypes} 
          fullScreen={false} 
          className="h-[80vh]"
        />
      </div>
    </div>
  );
};
