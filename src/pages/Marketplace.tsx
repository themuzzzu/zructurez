
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import OptimizedMarketplace from "./marketplace/OptimizedMarketplace";

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Render the marketplace with the proper layout
  // Important: We're NOT hiding the sidebar in desktop view anymore
  return (
    <Layout>
      <OptimizedMarketplace />
    </Layout>
  );
};

export default Marketplace;
