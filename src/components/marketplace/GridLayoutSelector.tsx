
import { Button } from "@/components/ui/button";
import { LayoutGrid, Rows, Columns, TableProperties } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface GridLayoutSelectorProps {
  layout: GridLayoutType;
  onChange: (layout: GridLayoutType) => void;
  className?: string;
}

export function GridLayoutSelector({ layout, onChange, className }: GridLayoutSelectorProps) {
  return (
    <div className={cn("inline-flex gap-1 bg-muted/30 p-1 rounded-md", className)}>
      <Button
        variant={layout === "grid2x2" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "h-8 w-8 p-0", 
          layout === "grid2x2" ? "bg-white dark:bg-zinc-800" : "bg-transparent"
        )}
        onClick={() => onChange("grid2x2")}
      >
        <Rows className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "grid3x3" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "h-8 w-8 p-0", 
          layout === "grid3x3" ? "bg-white dark:bg-zinc-800" : "bg-transparent"
        )}
        onClick={() => onChange("grid3x3")}
      >
        <Columns className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "grid4x4" ? "default" : "ghost"}
        size="sm"
        className={cn(
          "h-8 w-8 p-0", 
          layout === "grid4x4" ? "bg-white dark:bg-zinc-800" : "bg-transparent"
        )}
        onClick={() => onChange("grid4x4")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
