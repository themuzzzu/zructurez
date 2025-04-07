
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MarketplaceBannerProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
}

export const MarketplaceBanner = ({
  title = "Discover Amazing Products",
  subtitle = "Explore our wide range of high-quality products at great prices",
  actionLabel = "Shop Now",
  onAction,
  imageSrc = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80"
}: MarketplaceBannerProps) => {
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };
  
  return (
    <Card className="overflow-hidden border-0">
      <CardContent className="relative p-0 h-[200px] md:h-[300px]">
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt="Marketplace banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 max-w-md">{title}</h2>
          <p className="text-sm md:text-base max-w-md mb-6 text-white/80">{subtitle}</p>
          
          <div>
            <Button 
              onClick={handleAction}
              size="lg"
              className="bg-white text-black hover:bg-white/90 hover:text-black"
            >
              {actionLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceBanner;
