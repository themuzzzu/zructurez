
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BannerAdProps {
  ad: {
    id: string;
    title: string;
    image_url?: string;
    type: string;
    reference_id: string;
  };
}

export const BannerAd = ({ ad }: BannerAdProps) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    // Record click
    try {
      const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: ad.id });
      if (error) console.error('Error incrementing clicks:', error);
      
      // Navigate based on type
      switch(ad.type) {
        case 'business':
          navigate(`/business/${ad.reference_id}`);
          break;
        case 'service':
          navigate(`/services/${ad.reference_id}`);
          break;
        case 'product':
          navigate(`/product/${ad.reference_id}`);
          break;
      }
    } catch (err) {
      console.error('Error handling ad click:', err);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer relative hover:shadow-md transition-all mb-4" 
      onClick={handleClick}
    >
      {ad.image_url ? (
        <div className="relative aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1]">
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
            <div className="p-4 md:p-6 text-white">
              <h3 className="text-lg md:text-xl font-bold">{ad.title}</h3>
              <p className="text-sm mt-1">Click to learn more</p>
            </div>
          </div>
          <Badge className="absolute top-2 right-2 bg-yellow-500/90">
            Sponsored
          </Badge>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary/80 to-primary p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold">{ad.title}</h3>
            <p className="text-sm">Click to learn more</p>
          </div>
          <Badge className="bg-yellow-500/90">
            Sponsored
          </Badge>
        </div>
      )}
    </Card>
  );
};
