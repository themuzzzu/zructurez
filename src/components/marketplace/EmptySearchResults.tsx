
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm?: string;
}

export const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ searchTerm = "" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No products available yet"}
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchTerm
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Products will appear here once they're added to the marketplace."}
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/marketplace")}>
          Back to Marketplace
        </Button>
        
        <Button onClick={() => navigate("/")}>
          Browse Home
        </Button>
      </div>
    </div>
  );
};
