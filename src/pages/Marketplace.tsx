import OptimizedMarketplace from "./marketplace/OptimizedMarketplace";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Otherwise, render the marketplace
  return <OptimizedMarketplace />;
};

export default Marketplace;
