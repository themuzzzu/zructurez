import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCard } from "./ShoppingCard";
import { ProductsCarousel } from "./ProductsCarousel";
import { ServiceCard } from "./ServiceCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { ShoppingCardSkeleton } from "./ShoppingCardSkeleton";
import { Spinner } from "./common/Spinner";
import { formatPrice } from "@/utils/productUtils";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { EmptySearchResults } from "./marketplace/EmptySearchResults";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
  original_price?: number;
  is_discounted?: boolean;
  business_id?: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  provider_id: string;
  provider_name: string;
}

export interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
}

export const ShoppingSection = ({
  searchQuery = "",
  selectedCategory = "",
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest",
  priceRange = "all"
}: ShoppingSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from("products").select("*");

        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
          );
        }

        if (selectedCategory) {
          query = query.eq("category", selectedCategory.toLowerCase());
        }

        if (showDiscounted) {
          query = query.eq("is_discounted", true);
        }

        if (showUsed) {
          query = query.eq("is_used", true);
        }

        if (showBranded) {
          query = query.eq("is_branded", true);
        }

        if (priceRange !== "all") {
          const [min, max] = priceRange.split("-").map(Number);
          if (min && max) {
            query = query.gte("price", min).lte("price", max);
          } else if (min) {
            query = query.gte("price", min);
          }
        }

        switch (sortOption) {
          case "price-low":
            query = query.order("price", { ascending: true });
            break;
          case "price-high":
            query = query.order("price", { ascending: false });
            break;
          case "popular":
            query = query.order("views", { ascending: false });
            break;
          case "newest":
          default:
            query = query.order("created_at", { ascending: false });
            break;
        }

        query = query.limit(10);

        const { data: productsData, error: productsError } = await query;

        if (productsError) {
          console.error("Error fetching products:", productsError);
        } else {
          const transformedProducts = productsData.map(item => ({
            id: item.id,
            name: item.title || "",
            description: item.description || "",
            price: item.price || 0,
            image_url: item.image_url || "",
            discount_percentage: item.discount_percentage,
            original_price: item.original_price,
            is_discounted: item.is_discounted
          }));
          setProducts(transformedProducts);
        }

        const { data: servicesData } = await supabase
          .from("services")
          .select("*, providers(name)")
          .limit(10);

        if (servicesData) {
          const formattedServices = servicesData.map((service: any) => ({
            id: service.id,
            name: service.title || "",
            description: service.description || "",
            price: service.price || 0,
            image_url: service.image_url || "",
            provider_id: service.provider_id || "",
            provider_name: service.providers?.name || "Unknown Provider"
          }));
          setServices(formattedServices as Service[]);
        }

        const { data: businessesData } = await supabase
          .from("businesses")
          .select("id, name, category, description, image_url")
          .limit(10);

        if (businessesData) setBusinesses(businessesData as Business[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Discover</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ShoppingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const getFeaturedProducts = () => {
    return products.filter((product) => product.is_discounted).slice(0, 8);
  };

  const isSearchResults = !!searchQuery;

  if (isSearchResults && products.length === 0) {
    return <EmptySearchResults searchTerm={searchQuery} />;
  }

  return (
    <div className="space-y-6">
      {!isSearchResults && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Discover</h2>
          <Button
            variant="ghost"
            className="flex items-center text-primary"
            onClick={() => navigate("/marketplace")}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products available</h3>
              <p className="text-muted-foreground mb-4">Check back later for new products</p>
            </div>
          ) : (
            <>
              {!isSearchResults && getFeaturedProducts().length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
                  <ProductsCarousel products={getFeaturedProducts()} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 6).map((product) => (
                  <ShoppingCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    description={product.description || ""}
                    image={product.image_url}
                    price={formatPrice(product.price)}
                    originalPrice={
                      product.original_price ? formatPrice(product.original_price) : undefined
                    }
                    discountPercentage={product.discount_percentage}
                    type="product"
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No services available</h3>
              <p className="text-muted-foreground mb-4">Check back later for new services</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  description={service.description || ""}
                  image={service.image_url}
                  price={formatPrice(service.price)}
                  providerName={service.provider_name}
                  providerId={service.provider_id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="businesses" className="mt-6">
          {businesses.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No businesses available</h3>
              <p className="text-muted-foreground mb-4">Check back later for new businesses</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.slice(0, 6).map((business) => (
                <ShoppingCard
                  key={business.id}
                  id={business.id}
                  title={business.name}
                  description={business.description || ""}
                  image={business.image_url}
                  category={business.category}
                  type="business"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {!isSearchResults && (
        <Button
          onClick={() => navigate("/marketplace")}
          className="w-full mt-4"
          variant="outline"
        >
          View All Items
        </Button>
      )}
    </div>
  );
};
