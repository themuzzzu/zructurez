
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DiscountCollectionProps {
  title?: string;
  subtitle?: string;
  discount?: string;
  items?: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  viewAllLink?: string;
  gridLayout?: "grid4x4" | "grid2x2" | "grid1x1";
}

export const DiscountCollection = ({ 
  title = "Flash Sale", 
  subtitle = "Limited time offers",
  discount = "Up to 50% OFF", 
  items = [],
  viewAllLink = "/marketplace?discounted=true",
  gridLayout = "grid4x4"
}: DiscountCollectionProps) => {
  const navigate = useNavigate();
  
  // Sample items if none provided
  const defaultItems = [
    { id: "1", name: "Wireless Earbuds", image: "/placeholder.svg" },
    { id: "2", name: "Smart Watch", image: "/placeholder.svg" },
    { id: "3", name: "Bluetooth Speaker", image: "/placeholder.svg" },
    { id: "4", name: "Laptop Sleeve", image: "/placeholder.svg" },
    { id: "5", name: "Phone Case", image: "/placeholder.svg" },
    { id: "6", name: "Desk Lamp", image: "/placeholder.svg" },
    { id: "7", name: "Coffee Mug", image: "/placeholder.svg" },
    { id: "8", name: "Backpack", image: "/placeholder.svg" },
  ];
  
  const displayItems = items.length > 0 ? items : defaultItems;
  
  const handleItemClick = (id: string, name: string) => {
    navigate(`/marketplace?search=${encodeURIComponent(name)}`);
  };
  
  const handleViewAll = () => {
    if (viewAllLink) {
      navigate(viewAllLink);
    }
  };
  
  // Adjust grid layout based on the prop
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid2x2":
        return "grid grid-cols-2 gap-0";
      case "grid1x1":
        return "flex flex-col";
      case "grid4x4":
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0";
    }
  };
  
  return (
    <Card className="overflow-hidden mb-8">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-red-500">
            {discount}
          </Badge>
          
          {viewAllLink && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={handleViewAll}
            >
              View All
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className={getGridClasses()}>
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="border-r border-b last:border-r-0 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => handleItemClick(item.id, item.name)}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-md overflow-hidden mb-2">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center">{item.name}</span>
            </CardContent>
          </div>
        ))}
      </div>
    </Card>
  );
};
