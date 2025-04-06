
import { useState, useEffect } from "react";
import { PageLoader } from "./loaders/PageLoader";
import { useLoading } from "@/providers/LoadingProvider";

interface LoadingViewProps {
  section?: "general" | "marketplace" | "business" | "profile" | "messages" | "community";
  showProgress?: boolean;
}

export const LoadingView = ({ 
  section = "general",
  showProgress = false // Changed default to false to disable progress bars
}: LoadingViewProps) => {
  const [loaderType, setLoaderType] = useState<"bouncing" | "rangoli">("rangoli");
  const [iconTypes, setIconTypes] = useState<("car" | "coffee" | "palmtree" | "dot")[]>(["dot", "dot", "dot"]);
  const { progress } = useLoading();

  // Set loader type based on section
  useEffect(() => {
    // Choose loader type and icons based on section
    switch(section) {
      case "marketplace":
        setLoaderType("bouncing");
        setIconTypes(["car", "palmtree", "car"]);
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
        setIconTypes(Math.random() > 0.5 ? ["car", "coffee", "palmtree"] : ["dot", "dot", "dot"]);
    }
  }, [section]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px]">
        <PageLoader 
          type={loaderType} 
          iconType={iconTypes} 
          fullScreen={false} 
          className="h-[80vh]"
          showMessage={false} // Hide messages
        />
      </div>
    </div>
  );
}
