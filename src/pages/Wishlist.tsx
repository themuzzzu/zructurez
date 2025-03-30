
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductWishlist } from "@/components/wishlist/ProductWishlist";
import { BusinessWishlist } from "@/components/wishlist/BusinessWishlist";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <Layout>
      <div className="container max-w-[1400px] py-6 px-4">
        <div className="mb-6 flex items-center space-x-4">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>
        
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <ProductWishlist />
          </TabsContent>
          
          <TabsContent value="businesses" className="space-y-4">
            <BusinessWishlist />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Wishlist;
