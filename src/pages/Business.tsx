import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { SearchInput } from "@/components/SearchInput";
import { Layout } from "@/components/layout/Layout";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Business } from "@/types/business";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { BusinessCardHeader } from "@/components/business/BusinessCardHeader";
import { BusinessCardDescription } from "@/components/business/BusinessCardDescription";
import { BusinessCardInfo } from "@/components/business/BusinessCardInfo";
import { BusinessCardRating } from "@/components/business/BusinessCardRating";
import { BusinessCardActions } from "@/components/business/BusinessCardActions";
import { Card } from "@/components/ui/card";
import { CategoryIconGrid } from "@/components/marketplace/CategoryIconGrid";
import { CategorySubcategoryGrid } from "@/components/marketplace/CategorySubcategoryGrid";
import { BusinessBannerCarousel } from "@/components/business/BusinessBannerCarousel";
import { SponsoredBusinesses } from "@/components/business/SponsoredBusinesses";
import { SuggestedBusinesses } from "@/components/business/SuggestedBusinesses";
import { BusinessCategoryFilter } from "@/components/BusinessCategoryFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessWithRating {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  contact?: string;
  hours?: string;
  verified?: boolean;
  image_url?: string;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  created_at?: string;
  appointment_price?: number;
  consultation_price?: number;
  average_rating: number;
  reviews_count: number;
  business_ratings: Array<{ rating: number }>;
}

const BusinessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(subcategoryParam ? `${categoryParam}-${subcategoryParam}` : categoryParam);
    }
  }, [location.search]);
  
  const fetchBusinesses = async (): Promise<BusinessWithRating[]> => {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        business_ratings (*)
      `);
    
    if (selectedCategory !== "all") {
      if (selectedCategory.includes('-')) {
        const [category] = selectedCategory.split('-');
        query = query.eq('category', category);
      } else {
        query = query.eq('category', selectedCategory);
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map((business): BusinessWithRating => {
      const ratings = business.business_ratings || [];
      const totalRating = ratings.reduce((sum: number, rating: any) => sum + (rating.rating || 0), 0);
      const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
      
      return {
        id: business.id,
        name: business.name,
        description: business.description,
        category: business.category,
        location: business.location,
        contact: business.contact,
        hours: business.hours,
        verified: business.verified,
        image_url: business.image_url,
        is_open: business.is_open,
        wait_time: business.wait_time,
        closure_reason: business.closure_reason,
        created_at: business.created_at,
        appointment_price: business.appointment_price,
        consultation_price: business.consultation_price,
        average_rating: averageRating,
        reviews_count: ratings.length,
        business_ratings: ratings
      };
    });
  };
  
  const { data: businesses, isLoading, error, refetch } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: fetchBusinesses
  });

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;

  const filteredBusinesses = (businesses || []).filter(business => 
    business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (business.location && business.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case "oldest":
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case "rating":
        return (b.average_rating || 0) - (a.average_rating || 0);
      case "name_asc":
        return (a.name || '').localeCompare(b.name || '');
      case "name_desc":
        return (b.name || '').localeCompare(a.name || '');
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

  const formatHours = (hours: string | undefined): string => {
    if (!hours) return '';
    return hours;
  };

  const handleSubcategorySelect = (category: { id: string, name: string, icon: string }) => {
    const newCategory = `${category.id}`;
    setSelectedCategory(newCategory);
    
    navigate(`/businesses?category=${category.id}`);
  };

  const handleBusinessAction = (action: 'book' | 'whatsapp' | 'share' | 'call', businessId: string) => {
    switch (action) {
      case 'book':
        navigate(`/businesses/${businessId}/book`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=Check out this business: ${window.location.origin}/businesses/${businessId}`, '_blank');
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Business Details',
            url: `${window.location.origin}/businesses/${businessId}`,
          }).catch(err => {
            toast.error('Error sharing');
          });
        } else {
          navigator.clipboard.writeText(`${window.location.origin}/businesses/${businessId}`)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
        }
        break;
      case 'call':
        const business = businesses?.find(b => b.id === businessId);
        if (business?.contact) {
          window.location.href = `tel:${business.contact}`;
        } else {
          toast.error('No contact information available');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput 
            placeholder="Search for businesses..." 
            value={searchQuery} 
            onChange={setSearchQuery} 
            className="w-full max-w-3xl mx-auto"
          />
        </div>
        
        {/* Banner with Auto Scroll */}
        <BusinessBannerCarousel />
        
        {/* Categories Icon Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
          <CategoryIconGrid onCategorySelect={handleSubcategorySelect} />
        </div>
        
        {/* Sponsored Businesses Section */}
        <SponsoredBusinesses />
        
        {/* Suggested Businesses Section */}
        <SuggestedBusinesses />
        
        {/* Category Subcategories Grid */}
        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <CategorySubcategoryGrid onCategorySelect={handleSubcategorySelect} />
        </div>
        
        {/* Business Category Scroller */}
        <BusinessCategoryScroller />
        
        {/* All Businesses Section */}
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

          {businesses && businesses.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {sortedBusinesses.map((business) => (
                <motion.div 
                  key={business.id} 
                  className="relative h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link to={`/businesses/${business.id}`}>
                    <Card className="overflow-hidden h-full bg-black text-white flex flex-col">
                      <div className="relative">
                        {business.image_url ? (
                          <div className="h-48 w-full overflow-hidden">
                            <img 
                              src={business.image_url} 
                              alt={business.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                          </div>
                        ) : (
                          <div className="h-48 w-full bg-zinc-900">
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <BusinessCardHeader 
                            name={business.name}
                            category={business.category}
                            is_open={business.is_open}
                            verified={business.verified || false}
                            wait_time={business.wait_time}
                            closure_reason={business.closure_reason}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-4">
                          <BusinessCardDescription description={business.description} />
                          
                          <BusinessCardInfo 
                            location={business.location || ''}
                            hours={formatHours(business.hours)}
                            appointment_price={business.appointment_price}
                            consultation_price={business.consultation_price}
                          />
                          
                          <BusinessCardRating 
                            rating={business.average_rating || 0}
                            reviews={business.reviews_count || 0}
                            businessId={business.id}
                          />
                        </div>
                      </div>
                      
                      <BusinessCardActions
                        appointment_price={business.appointment_price}
                        onBookClick={() => handleBusinessAction('book', business.id)}
                        onWhatsAppClick={() => handleBusinessAction('whatsapp', business.id)}
                        onShareClick={() => handleBusinessAction('share', business.id)}
                        onCallClick={() => handleBusinessAction('call', business.id)}
                        is_open={business.is_open}
                      />
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No businesses found. Be the first to register your business!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPage;
