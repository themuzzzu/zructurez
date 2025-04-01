
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductWishlist } from "@/components/wishlist/ProductWishlist";
import { BusinessWishlist } from "@/components/wishlist/BusinessWishlist";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  // Store the previous path when component mounts
  useEffect(() => {
    const storedPath = sessionStorage.getItem('previousPath');
    if (storedPath) {
      setPreviousPath(storedPath);
    }
  }, []);

  // Handle back navigation
  const handleBackClick = () => {
    if (previousPath) {
      navigate(previousPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <Layout>
      <LikeProvider>
        <div className="container max-w-[1400px] py-6 px-4">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBackClick}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>
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
      </LikeProvider>
    </Layout>
  );
};

export default Wishlist;
