
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchInput } from "@/components/SearchInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";

type SearchCategory = "all" | "users" | "products" | "posts" | "businesses" | "services";

export default function UnifiedSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<SearchCategory>("all");
  
  const { results, isLoading } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });
  
  const handleClear = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-4">
        {/* Search Header */}
        <div className="relative mb-6">
          <SearchInput
            value={query}
            onChange={(value) => {
              const params = new URLSearchParams(searchParams);
              params.set("q", value);
              setSearchParams(params);
            }}
            className="w-full h-12 bg-muted/50"
            placeholder="Search..."
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as SearchCategory)}>
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none h-auto p-0 space-x-6">
            <TabsTrigger 
              value="all"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="posts"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="businesses"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Businesses
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="pb-2 px-0 data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Services
            </TabsTrigger>
          </TabsList>

          {/* Results Sections */}
          {query ? (
            <div className="space-y-8">
              {activeTab === "users" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">USERS</h2>
                  <div className="space-y-4">
                    {/* Example user result */}
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer">
                      <Avatar className="h-12 w-12" />
                      <div>
                        <h3 className="font-medium">Simon Matthews</h3>
                        <p className="text-sm text-muted-foreground">Plumber</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "products" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">PRODUCTS</h2>
                  <div className="grid gap-4">
                    <div className="flex gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer">
                      <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden">
                        <img src="/placeholder.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">Plumbing Repair Kit</h3>
                        <p className="text-sm text-muted-foreground">Complete toolkit for basic plumbing repairs</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Similar sections for posts, businesses, and services */}
              {activeTab === "posts" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">POSTS</h2>
                  {/* Post results */}
                </div>
              )}

              {activeTab === "businesses" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">BUSINESSES</h2>
                  {/* Business results */}
                </div>
              )}

              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">SERVICES</h2>
                  {/* Service results */}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Enter a search term to begin</p>
            </div>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
