
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const WishlistSuggestions = () => {
  const navigate = useNavigate();
  
  const suggestions = [
    { 
      id: "1", 
      name: "Gym Bag", 
      image: "https://images.unsplash.com/photo-1614546366955-8486538f1b2a?q=80&w=300&h=300&auto=format&fit=crop"
    },
    { 
      id: "2", 
      name: "Electric Cookers", 
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&h=300&auto=format&fit=crop"
    },
    { 
      id: "3", 
      name: "Headphones", 
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&h=300&auto=format&fit=crop" 
    },
    { 
      id: "4", 
      name: "Smart Watches", 
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&h=300&auto=format&fit=crop" 
    }
  ];
  
  const handleItemClick = (id: string, name: string) => {
    navigate(`/marketplace?search=${encodeURIComponent(name)}`);
  };
  
  return (
    <div className="mb-8">
      <Card className="overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <Heart className="mr-2 h-5 w-5 fill-white" />
            Add to your wishlist
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-white">
          {suggestions.map((item) => (
            <Card 
              key={item.id}
              className="border-0 cursor-pointer hover:shadow-md transition-shadow"
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
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
