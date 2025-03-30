
import { LayoutGrid, Grid2X2, Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GridLayoutSelectorProps {
  layout: "grid4x4" | "grid2x2" | "grid1x1";
  onChange: (layout: "grid4x4" | "grid2x2" | "grid1x1") => void;
}

export const GridLayoutSelector = ({ layout, onChange }: GridLayoutSelectorProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant={layout === "grid4x4" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => onChange("grid4x4")}
        title="4×4 Grid"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant={layout === "grid2x2" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => onChange("grid2x2")}
        title="2×2 Grid"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant={layout === "grid1x1" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => onChange("grid1x1")}
        title="List View"
      >
        <Grip className="h-4 w-4" />
      </Button>
    </div>
  );
};
