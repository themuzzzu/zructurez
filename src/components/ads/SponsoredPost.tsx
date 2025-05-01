
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { incrementAdClick } from "@/services/adService";

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  reference_id?: string;
  type?: string;
}

interface SponsoredPostProps {
  ad: Ad;
}

export const SponsoredPost: React.FC<SponsoredPostProps> = ({ ad }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    incrementAdClick(ad.id);
    
    if (ad.reference_id && ad.type) {
      switch (ad.type) {
        case 'business':
          navigate(`/business/${ad.reference_id}`);
          break;
        case 'product':
          navigate(`/product/${ad.reference_id}`);
          break;
        case 'service':
          navigate(`/service/${ad.reference_id}`);
          break;
        default:
          // Just open the ad URL if available
          if (ad.image_url && ad.image_url.startsWith('http')) {
            window.open(ad.image_url, '_blank');
          }
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {ad.image_url && (
          <div className="sm:w-1/3 h-48 sm:h-auto">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{ad.title}</h3>
            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Sponsored
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            {ad.description}
          </p>
          <Button onClick={handleClick} className="self-start">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
