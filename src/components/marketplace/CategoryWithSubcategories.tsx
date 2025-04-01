
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CategoryItem {
  name: string;
  slug: string;
  description?: string;
  price?: string;
  image?: string;
}

interface CategoryWithSubcategoriesProps {
  title: string;
  slug: string;
  subcategories: CategoryItem[];
  onCategorySelect?: (category: string, subcategory?: string) => void;
}

export const CategoryWithSubcategories = ({
  title,
  slug,
  subcategories,
  onCategorySelect
}: CategoryWithSubcategoriesProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (subcategory: string) => {
    if (onCategorySelect) {
      onCategorySelect(slug, subcategory);
    } else {
      navigate(`/marketplace?category=${slug}&subcategory=${subcategory}`);
    }
  };

  const handleCategoryClick = () => {
    if (onCategorySelect) {
      onCategorySelect(slug);
    } else {
      navigate(`/marketplace?category=${slug}`);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="font-medium text-base">{title}</h3>
          <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        
        {isExpanded && (
          <div className="mt-3 space-y-2">
            <div 
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={handleCategoryClick}
            >
              View all {title}
            </div>
            {subcategories.map((subcat) => (
              <div 
                key={subcat.slug} 
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded px-2 transition-colors"
                onClick={() => handleItemClick(subcat.slug)}
              >
                <div className="flex items-center">
                  {subcat.image && (
                    <img 
                      src={subcat.image} 
                      alt={subcat.name}
                      className="h-8 w-8 object-contain mr-2"
                    />
                  )}
                  <span className="text-sm">{subcat.name}</span>
                </div>
                {subcat.price && (
                  <span className="text-xs text-gray-500">{subcat.price}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
