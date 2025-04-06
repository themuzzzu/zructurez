
import { LayoutGrid, Grid2X2, Grip, List, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useEffect } from "react";

interface GridLayoutSelectorProps {
  layout: GridLayoutType;
  onChange: (layout: GridLayoutType) => void;
}

export const GridLayoutSelector = ({ layout, onChange }: GridLayoutSelectorProps) => {
  // Log when layout changes
  useEffect(() => {
    console.log("GridLayoutSelector received layout:", layout);
  }, [layout]);
  
  const handleLayoutChange = (newLayout: GridLayoutType) => {
    console.log("Changing layout to:", newLayout);
    onChange(newLayout);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant={layout === "grid4x4" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => handleLayoutChange("grid4x4")}
        title="4×4 Grid"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant={layout === "grid3x3" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => handleLayoutChange("grid3x3")}
        title="3×3 Grid"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant={layout === "grid2x2" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => handleLayoutChange("grid2x2")}
        title="2×2 Grid"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant={layout === "list" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => handleLayoutChange("list")}
        title="List View"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
