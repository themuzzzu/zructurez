
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CategoryHeaderProps {
  categoryName: string;
  subcategory?: string;
  isLoading?: boolean;
  onLayoutChange?: (newLayout: "list" | "grid4x4" | "grid3x3" | "grid2x2") => void;
  onSearch?: (searchTerm: string) => void;
}

export const CategoryHeader = ({ 
  categoryName, 
  subcategory,
  isLoading,
  onLayoutChange,
  onSearch 
}: CategoryHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/marketplace" className="hover:underline">Marketplace</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to={`/marketplace/category/${categoryName.toLowerCase()}`} className="hover:underline">
          {categoryName}
        </Link>
        {subcategory && (
          <>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{subcategory}</span>
          </>
        )}
      </div>
      
      <h1 className="text-3xl font-bold">{subcategory || categoryName}</h1>
      <p className="text-muted-foreground mt-1">
        Browse all products in the {subcategory || categoryName} category
      </p>
    </div>
  );
};

export default CategoryHeader;
