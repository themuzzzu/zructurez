
import { useState } from "react";
import { SearchHero } from "@/components/home/SearchHero";
import { MarketplaceSection } from "@/components/marketplace/MarketplaceSection";
import { BusinessSection } from "@/components/business/BusinessSection";
import { ServiceSection } from "@/components/service/ServiceSection";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";

export default function OptimizedMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="space-y-4">
      <SearchHero onSearch={handleSearch} />
      
      <Tabs 
        defaultValue="products" 
        className="w-full" 
        onValueChange={(value) => setSelectedTab(value)}
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="products" className="text-xs px-3 py-1.5">Products</TabsTrigger>
            <TabsTrigger value="businesses" className="text-xs px-3 py-1.5">Businesses</TabsTrigger>
            <TabsTrigger value="services" className="text-xs px-3 py-1.5">Services</TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1 h-7"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-3 w-3" />
            Filters
          </Button>
        </div>
        
        {searchQuery && (
          <div className="mb-4 mt-2">
            <h2 className="text-lg font-bold">Search results for "{searchQuery}"</h2>
          </div>
        )}
        
        <TabsContent value="products" className="space-y-5 mt-4">
          {!searchQuery && (
            <>
              <MarketplaceSection type="trending" />
              <MarketplaceSection type="sponsored" />
              <MarketplaceSection type="suggested" />
              
              <div className="pt-5">
                <ShoppingSection
                  searchQuery={searchQuery}
                  gridLayout="grid2x2"
                  title="All Products"
                />
              </div>
            </>
          )}
          
          {searchQuery && (
            <ShoppingSection searchQuery={searchQuery} gridLayout="grid3x3" />
          )}
        </TabsContent>
        
        <TabsContent value="businesses" className="space-y-5 mt-4">
          {!searchQuery ? (
            <>
              <BusinessSection type="trending" />
              <BusinessSection type="sponsored" />
              <BusinessSection type="suggested" />
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Business search results for "{searchQuery}"</h3>
              <p className="text-sm text-muted-foreground mt-2">Please use the search filters to refine your results</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services" className="space-y-5 mt-4">
          {!searchQuery ? (
            <>
              <ServiceSection type="trending" />
              <ServiceSection type="sponsored" />
              <ServiceSection type="suggested" />
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Service search results for "{searchQuery}"</h3>
              <p className="text-sm text-muted-foreground mt-2">Please use the search filters to refine your results</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
