
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MarketplaceBanner = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome to the Marketplace</h2>
      <p className="mb-4">Discover products from local and global sellers</p>
      <Button 
        variant="secondary" 
        onClick={() => navigate("/products/new")}
        className="bg-white text-blue-600 hover:bg-gray-100"
      >
        Sell Your Product
      </Button>
    </div>
  );
};
