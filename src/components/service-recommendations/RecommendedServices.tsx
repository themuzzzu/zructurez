
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  getRecommendedServices, 
  getTrendingServicesInArea 
} from "@/services/serviceService";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image_url?: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  } | null;
}

export const RecommendedServices = ({ userLocation }: { userLocation?: string }) => {
  const [recommendations, setRecommendations] = useState<ServiceItem[]>([]);
  const [trendingServices, setTrendingServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        // If user is logged in, get personalized recommendations
        if (user) {
          const recommendedData = await getRecommendedServices(user.id);
          setRecommendations(recommendedData as ServiceItem[]);
        }
        
        // Get trending services in the area
        if (userLocation) {
          const trendingData = await getTrendingServicesInArea(userLocation);
          setTrendingServices(trendingData as ServiceItem[]);
        }
      } catch (error) {
        console.error("Error loading service recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user, userLocation]);
  
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommended Services</CardTitle>
          <CardDescription>Finding services for you...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // If no recommendations or trending services, show placeholder
  if ((!user || recommendations.length === 0) && (!userLocation || trendingServices.length === 0)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommended Services</CardTitle>
          <CardDescription>Discover services tailored to your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {user 
              ? "Browse more services to get personalized recommendations"
              : "Sign in to get personalized service recommendations"}
          </p>
          {!user && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>
          {user && recommendations.length > 0 
            ? "Services based on your preferences" 
            : `Trending services ${userLocation ? `in ${userLocation}` : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user && recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleServiceClick(service.id)} 
              />
            ))
          ) : trendingServices.length > 0 ? (
            trendingServices.slice(0, 3).map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleServiceClick(service.id)} 
                trending
              />
            ))
          ) : null}
        </div>
        
        {(recommendations.length > 3 || trendingServices.length > 3) && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate("/services")}>
              View More Services
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Service card subcomponent
const ServiceCard = ({ 
  service, 
  onClick,
  trending = false
}: { 
  service: ServiceItem; 
  onClick: () => void;
  trending?: boolean;
}) => {
  // Get username and avatar safely
  const username = service.profiles?.username || "Service provider";
  const avatarUrl = service.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.id}`;

  return (
    <div 
      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={service.image_url || "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800"} 
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {trending && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Trending
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-semibold text-white">{service.title}</h3>
          <p className="text-xs text-white/90">{service.category}</p>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{service.location}</span>
          <span className="font-semibold">${service.price}/hr</span>
        </div>
        <div className="flex items-center mt-2">
          <img 
            src={avatarUrl} 
            alt={username} 
            className="w-6 h-6 rounded-full" 
          />
          <span className="text-xs ml-2 text-muted-foreground">
            {username}
          </span>
        </div>
      </div>
    </div>
  );
};
