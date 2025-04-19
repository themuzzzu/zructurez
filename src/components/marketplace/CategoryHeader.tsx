
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryHeaderProps {
  categoryName: string;
  onLayoutChange: (layout: "grid4x4" | "grid3x3" | "grid2x2" | "list") => void;
  onSearch: (term: string) => void;
  isLoading?: boolean;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryName,
  onLayoutChange,
  onSearch,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold capitalize">
          {categoryName || "Category"}
          {isLoading && <span className="ml-2 text-muted-foreground text-base">Loading...</span>}
        </h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search in this category"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLayoutChange("grid4x4")}
            className="p-2 hidden md:flex"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLayoutChange("list")}
            className="p-2 hidden md:flex"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
