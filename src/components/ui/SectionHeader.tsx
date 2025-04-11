
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  viewAllLink?: string;
  relatedCategories?: Array<{id: string; name: string;}>;
  onCategoryClick?: (categoryId: string) => void;
}

export function SectionHeader({ 
  title, 
  icon, 
  viewAllLink, 
  relatedCategories = [],
  onCategoryClick 
}: SectionHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base font-bold">{title}</h3>
        </div>
        
        {viewAllLink && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary flex items-center gap-1 h-7 px-2"
            onClick={() => navigate(viewAllLink)}
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {relatedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {relatedCategories.map((category) => (
            <Badge 
              key={category.id} 
              variant="outline" 
              className="text-[10px] py-0 h-5 bg-background dark:bg-gray-800 cursor-pointer hover:bg-secondary transition-colors"
              onClick={() => onCategoryClick && onCategoryClick(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
