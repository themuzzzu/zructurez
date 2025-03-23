
import { Navbar } from "@/components/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCategoryFilter } from "@/components/BusinessCategoryFilter";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateBusinessForm } from "@/components/CreateBusinessForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Business = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          business_products (*),
          business_ratings (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate average rating for each business
      const businessesWithRating = data?.map(business => {
        const ratings = business.business_ratings || [];
        const totalRating = ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
        
        return {
          ...business,
          average_rating: averageRating
        };
      }) || [];
      
      return businessesWithRating;
    }
  });

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;

  // Filter businesses by category and search query
  const filteredBusinesses = businesses?.filter(business => 
    (selectedCategory === "all" || business.category === selectedCategory) &&
    (
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.location && business.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ) || [];

  // Sort businesses according to selected option
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "rating":
        return (b.average_rating || 0) - (a.average_rating || 0);
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold animate-fade-up">Local Businesses</h1>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Cancel" : "Register Business"}
            </Button>
          </div>

          {showCreateForm ? (
            <CreateBusinessForm 
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <SearchInput
                    placeholder="Search businesses by name, description, category, or location..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full md:max-w-xl"
                  />
                  <div className="w-full md:w-64">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <BusinessCategoryFilter onCategoryChange={handleCategoryChange} />
              </div>

              {sortedBusinesses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No businesses found. Be the first to register your business!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedBusinesses.map((business) => (
                    <div key={business.id} className="relative">
                      {business.average_rating >= 4.5 && (
                        <Badge variant="success" className="absolute top-2 right-2 z-10 px-2 py-1">
                          Top Rated
                        </Badge>
                      )}
                      {business.location && (
                        <div className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-xs rounded px-2 py-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {business.location}
                        </div>
                      )}
                      <BusinessCard 
                        key={business.id}
                        {...business}
                        image={business.image_url || '/placeholder.svg'}
                        rating={business.average_rating || 0}
                        reviews={business.business_ratings?.length || 0}
                        serviceName={business.category}
                        cost={business.business_products?.[0]?.price || 0}
                        is_open={business.is_open}
                        wait_time={business.wait_time}
                        closure_reason={business.closure_reason}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Business;
