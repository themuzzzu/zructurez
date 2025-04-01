
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCategoryFilter } from "@/components/BusinessCategoryFilter";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateBusinessForm } from "@/components/CreateBusinessForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchHero } from "@/components/home/SearchHero";
import { BusinessCategoryGrid } from "@/components/home/BusinessCategoryGrid";
import { QuickAccessServices } from "@/components/home/QuickAccessServices";
import { TrendingServices } from "@/components/home/TrendingServices";
import { PopularCategories } from "@/components/home/PopularCategories";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { DealsSection } from "@/components/home/DealsSection";
import { BusinessCategoryNavBar } from "@/components/business/BusinessCategoryNavBar";

const Business = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(subcategoryParam ? `${categoryParam}-${subcategoryParam}` : categoryParam);
    }
  }, [location.search]);
  
  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          business_products (*),
          business_ratings (*)
        `)
        .order('created_at', { ascending: false });
      
      // Filter by category if not "all"
      if (selectedCategory !== "all") {
        // Check if it's a subcategory selection (contains a hyphen)
        if (selectedCategory.includes('-')) {
          const [category, subcategory] = selectedCategory.split('-');
          query = query.eq('category', category).eq('subcategory', subcategory);
        } else {
          query = query.eq('category', selectedCategory);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
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

  const filteredBusinesses = businesses?.filter(business => 
    (
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.location && business.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ) || [];

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
    
    if (category === "all") {
      navigate("/businesses");
    } else {
      navigate(`/businesses?category=${category}`);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-[1400px] mx-auto pt-20 pb-24 px-4 sm:px-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold animate-fade-up">Local Businesses</h1>
            </div>
            <Link to="/register-business">
              <Button className="w-full sm:w-auto gap-2">
                <Plus className="h-4 w-4" />
                Register Business
              </Button>
            </Link>
          </div>

          {showCreateForm ? (
            <CreateBusinessForm 
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <>
              {/* Hero Section with Search */}
              <SearchHero />
              
              {/* Add Business Category Navigation Bar */}
              <BusinessCategoryNavBar />
              
              <div className="space-y-8 mt-8">
                {/* Business Categories Grid */}
                <BusinessCategoryGrid />
                
                {/* Quick Access Services - Mobile Only */}
                <div className="block sm:hidden">
                  <QuickAccessServices />
                </div>
                
                {/* Trending Services */}
                <TrendingServices />
                
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">All Businesses</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                    <BusinessCategoryFilter onCategoryChange={handleCategoryChange} />
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

                  {sortedBusinesses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No businesses found. Be the first to register your business!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedBusinesses.map((business) => {
                        const {
                          id,
                          name,
                          category,
                          description,
                          image_url,
                          location,
                          contact,
                          hours,
                          verified,
                          appointment_price,
                          consultation_price,
                          is_open,
                          wait_time,
                          closure_reason
                        } = business;
                        
                        return (
                          <div key={id} className="h-full">
                            <BusinessCard 
                              id={id}
                              name={name}
                              category={category}
                              description={description}
                              image={image_url || '/placeholder.svg'}
                              rating={business.average_rating || 0}
                              reviews={business.business_ratings?.length || 0}
                              location={location || ''}
                              contact={contact || ''}
                              hours={hours || ''}
                              verified={verified || false}
                              appointment_price={appointment_price}
                              consultation_price={consultation_price}
                              is_open={is_open}
                              wait_time={wait_time}
                              closure_reason={closure_reason}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Business;
