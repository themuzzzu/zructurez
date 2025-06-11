
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Advertisement, incrementAdClick } from '@/services/adService';

interface BannerAdProps {
  ad: Advertisement;
}

export const BannerAd: React.FC<BannerAdProps> = ({ ad }) => {
  const handleClick = async () => {
    await incrementAdClick(ad.id);
    
    if (ad.reference_id) {
      // Navigate based on ad type
      if (ad.type === 'product') {
        window.location.href = `/product/${ad.reference_id}`;
      } else if (ad.type === 'business') {
        window.location.href = `/business/${ad.reference_id}`;
      } else if (ad.type === 'service') {
        window.location.href = `/service/${ad.reference_id}`;
      }
    } else if (ad.image_url) {
      window.open(ad.image_url, '_blank');
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative h-[180px] md:h-[200px]">
        {ad.image_url ? (
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
              <p className="text-sm opacity-90">{ad.description}</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-yellow-500/90 text-white">
            Sponsored
          </Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{ad.title}</h3>
          <p className="text-white/90 text-sm">{ad.description}</p>
        </div>
      </div>
    </Card>
  );
};
