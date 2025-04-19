
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const MarketplaceBanner = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8">
      <div className="relative z-10 max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to the Marketplace</h1>
        <p className="text-blue-100 mb-4">Find the best products from trusted sellers at great prices</p>
        <Button 
          onClick={() => navigate('/marketplace/deals')}
          className="bg-white text-blue-700 hover:bg-blue-50"
        >
          Explore Today's Deals
        </Button>
      </div>
      
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};
