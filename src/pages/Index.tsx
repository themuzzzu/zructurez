
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
      <p className="text-xl mb-8">Choose where you want to go:</p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button size="lg" onClick={() => navigate('/marketplace')}>
          Visit Marketplace
        </Button>
        
        <Button size="lg" onClick={() => navigate('/shop')}>
          Visit Shop
        </Button>
      </div>
    </div>
  );
};

export default Index;
