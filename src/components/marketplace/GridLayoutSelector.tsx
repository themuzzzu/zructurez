
import { LayoutGrid, Grid2X2, List, Grid3X3, SquareStackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GridLayoutSelectorProps {
  layout: GridLayoutType;
  onChange: (layout: GridLayoutType) => void;
  compact?: boolean;
}

export const GridLayoutSelector = ({ 
  layout, 
  onChange, 
  compact = false 
}: GridLayoutSelectorProps) => {
  // State to track layout
  const [selectedLayout, setSelectedLayout] = useState<GridLayoutType>(layout);
  
  // Log when layout changes
  useEffect(() => {
    console.log("GridLayoutSelector received layout:", layout);
    setSelectedLayout(layout);
  }, [layout]);
  
  const handleLayoutChange = (newLayout: GridLayoutType) => {
    console.log("Changing layout to:", newLayout);
    setSelectedLayout(newLayout);
    onChange(newLayout);
    
    // Save layout preference to localStorage
    localStorage.setItem("preferredGridLayout", newLayout);
  };

  const buttonSize = compact ? "h-7 w-7" : "h-8 w-8";
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={selectedLayout === "grid4x4" ? "default" : "outline"}
              className={buttonSize}
              onClick={() => handleLayoutChange("grid4x4")}
            >
              <LayoutGrid className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>4×4 Grid</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={selectedLayout === "grid3x3" ? "default" : "outline"}
              className={buttonSize}
              onClick={() => handleLayoutChange("grid3x3")}
            >
              <Grid3X3 className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>3×3 Grid</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={selectedLayout === "grid2x2" ? "default" : "outline"}
              className={buttonSize}
              onClick={() => handleLayoutChange("grid2x2")}
            >
              <Grid2X2 className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>2×2 Grid</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={selectedLayout === "list" ? "default" : "outline"}
              className={buttonSize}
              onClick={() => handleLayoutChange("list")}
            >
              <List className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>List View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
