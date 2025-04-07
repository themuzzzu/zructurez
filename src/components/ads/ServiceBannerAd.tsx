
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { generateMockAds } from "@/services/adService";
import { ArrowRight } from "lucide-react";

// Use predefined non-UUID IDs for static demo ads that won't cause database errors
const SERVICE_BANNER_ADS = [
  {
    id: "static-demo-1", // non-UUID id to avoid DB errors
    title: "Professional Home Cleaning",
    description: "Get spotless results with our professional cleaning services. Book now for a special discount!",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&h=400&q=80",
    reference_id: "/services"
  },
  {
    id: "static-demo-2", // non-UUID id to avoid DB errors
    title: "Expert Plumbing Services",
    description: "Fast, reliable plumbing repairs and installations. Available 24/7 for emergencies.",
    image_url: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&h=400&q=80",
    reference_id: "/services"
  }
];

export function ServiceBannerAd() {
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  // Rotate through ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % SERVICE_BANNER_ADS.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentAd = SERVICE_BANNER_ADS[currentAdIndex];
  
  const handleClick = () => {
    navigate(currentAd.reference_id);
  };
  
  if (!currentAd) return null;
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      <div 
        className="w-full h-48 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentAd.image_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="text-white p-6 md:p-10 max-w-md">
            <div className="text-xs uppercase tracking-wide bg-primary px-2 py-1 rounded-full inline-block mb-3">
              Sponsored
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{currentAd.title}</h3>
            <p className="text-sm md:text-base opacity-90 mb-4">{currentAd.description}</p>
            <Button className="mt-2" variant="secondary">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
