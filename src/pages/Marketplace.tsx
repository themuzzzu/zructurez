
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import OptimizedMarketplace from "./marketplace/OptimizedMarketplace";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Render the marketplace with the proper layout
  return (
    <Layout>
      <div className="overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <BannerCarousel />
        </div>
        <OptimizedMarketplace />
      </div>
    </Layout>
  );
};

export default Marketplace;
