
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MapPin, Clock, Star, ExternalLink, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { trackServiceView, trackContactClick } from "@/services/serviceService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  providerName?: string;
  providerId: string;
  category?: string;
  location?: string;
  views?: number;
  rating?: number;
  sponsored?: boolean;
}

export const ServiceCard = ({
  id,
  title,
  description,
  image_url,
  price,
  providerName,
  providerId,
  category,
  location,
  views,
  rating = 4.5,
  sponsored = false
}: ServiceCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    trackServiceView(id); // Track the view
    navigate(`/services/${id}`);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/businesses/${providerId}`);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setAnimating(true);
    
    // Reset animation state after animation completes
    setTimeout(() => setAnimating(false), 1000);
    
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackContactClick(id);
    toast.success("Contact details shared! A provider will call you shortly.");
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleClick}>
        <img 
          src={image_url || '/placeholder-service.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {sponsored && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-blue-500/80 text-white hover:bg-blue-600 border-none"
          >
            Sponsored
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2 cursor-pointer" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 relative"
            onClick={toggleLike}
          >
            <Heart 
              className={`h-4 w-4 z-10 ${isLiked ? 'fill-red-500 text-red-500' : ''} ${isLiked && animating ? 'scale-110' : ''}`} 
            />
            
            {/* Heart animation on like */}
            <AnimatePresence>
              {animating && isLiked && (
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0.7 }}
                      animate={{ 
                        scale: 1.5, 
                        opacity: 0,
                        x: Math.random() * 20 - 10,
                        y: Math.random() * -30 - 10
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-3 h-3 rounded-full bg-red-400"
                    />
                  ))}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.7 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-8 h-8 rounded-full bg-red-200"
                  />
                </div>
              )}
            </AnimatePresence>
          </Button>
        </div>
        
        {providerName && (
          <Badge 
            variant="outline" 
            className="text-xs bg-transparent cursor-pointer hover:bg-secondary"
            onClick={handleProviderClick}
          >
            {providerName}
          </Badge>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2">
          <span className="font-bold">₹{price.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            {rating}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1 gap-2" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${id}/book`);
          }}
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </Button>
        <Button 
          variant="outline"
          className="flex-1 gap-2" 
          onClick={handleCallClick}
        >
          <Phone className="h-4 w-4" />
          Call
        </Button>
      </CardFooter>
    </Card>
  );
};
