
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  providerName: string;
  providerId: string;
}

export const ServiceCard = ({
  id,
  name,
  description,
  image,
  price,
  providerName,
  providerId
}: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${id}`);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/businesses/${providerId}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || '/placeholder-image.jpg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{name}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <Badge 
          variant="outline" 
          className="text-xs bg-transparent cursor-pointer hover:bg-secondary"
          onClick={handleProviderClick}
        >
          {providerName}
        </Badge>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2">
          <span className="font-bold">{price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${id}/book`);
          }}
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};
