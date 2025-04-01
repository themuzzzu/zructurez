
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import OptimizedMarketplace from "./marketplace/OptimizedMarketplace";
import { LikeProvider } from "@/components/products/LikeContext";

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Render the marketplace with the proper layout and LikeProvider
  return (
    <Layout>
      <div className="overflow-x-hidden">
        <LikeProvider>
          <OptimizedMarketplace />
        </LikeProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
