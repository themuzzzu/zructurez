
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BusinessCard } from "@/components/BusinessCard";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, TrendingUp, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateBusinessForm } from "@/components/CreateBusinessForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchHero } from "@/components/home/SearchHero";
import { toast } from "sonner";
import type { Business, BusinessOwner, BusinessHours, StaffMember } from "@/types/business";
import { BusinessBannerAd } from "@/components/ads/BusinessBannerAd";
import { Card } from "@/components/ui/card";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { motion } from "framer-motion";

// Lazy load components for better performance
const BusinessRankingsSection = lazy(() => import('@/components/business/BusinessRankingsSection').then(
  mod => ({ default: mod.BusinessRankingsSection })
));

const LocalBusinessSpotlight = lazy(() => import('@/components/marketplace/LocalBusinessSpotlight').then(
  mod => ({ default: mod.LocalBusinessSpotlight })
));

// Skeleton component for lazy loading
const SkeletonCard = () => (
  <Card className="overflow-hidden border h-[300px]">
    <div className="h-40 bg-muted animate-pulse"></div>
    <div className="p-4 space-y-2">
      <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
      <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
    </div>
  </Card>
);

interface BusinessWithRating extends Omit<Business, 'owners' | 'staff_details' | 'image_position' | 'verification_documents' | 'membership_plans'> {
  average_rating: number;
  reviews_count: number;
  business_ratings: Array<{ rating: number }>;
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
  image_position?: { x: number; y: number; };
  verification_documents?: any[];
  membership_plans?: any[];
}

const LazySection = ({ children, title, fallbackCount = 4 }: { children: React.ReactNode, title?: string, fallbackCount?: number }) => (
  <div className="mb-8">
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          {title}
        </h2>
      </div>
    )}
    <Suspense fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: fallbackCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    }>
      {children}
    </Suspense>
  </div>
);

const Business = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>(() => {
    // Try to get user's saved preference from localStorage
    const savedLayout = localStorage.getItem("preferredBusinessGridLayout");
    return (savedLayout as GridLayoutType) || "grid3x3";
  });
  
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
      
      // Convert owners from JSON to proper BusinessOwner[] type
      let typedOwners: BusinessOwner[] = [];
      try {
        if (business.owners && typeof business.owners === 'object' && Array.isArray(business.owners)) {
          typedOwners = business.owners as unknown as BusinessOwner[];
        }
      } catch (e) {
        console.error("Error parsing owners:", e);
      }

      // Convert staff_details from JSON to proper StaffMember[] type
      let typedStaffDetails: StaffMember[] = [];
      try {
        if (business.staff_details && typeof business.staff_details === 'object' && Array.isArray(business.staff_details)) {
          typedStaffDetails = business.staff_details as unknown as StaffMember[];
        }
      } catch (e) {
        console.error("Error parsing staff details:", e);
      }
      
      // Parse image_position from JSON to the expected object structure
      let typedImagePosition: { x: number; y: number; } | undefined;
      try {
        if (business.image_position) {
          if (typeof business.image_position === 'object') {
            typedImagePosition = business.image_position as unknown as { x: number; y: number; };
          } else if (typeof business.image_position === 'string') {
            typedImagePosition = JSON.parse(business.image_position);
          }
        }
      } catch (e) {
        console.error("Error parsing image position:", e);
        // Provide default values if parsing fails
        typedImagePosition = { x: 50, y: 50 };
      }
      
      // Parse verification_documents from JSON to array
      let typedVerificationDocuments: any[] = [];
      try {
        if (business.verification_documents) {
          if (typeof business.verification_documents === 'object' && Array.isArray(business.verification_documents)) {
            typedVerificationDocuments = business.verification_documents as any[];
          } else if (typeof business.verification_documents === 'string') {
            typedVerificationDocuments = JSON.parse(business.verification_documents);
          }
        }
      } catch (e) {
        console.error("Error parsing verification documents:", e);
        // Provide default empty array if parsing fails
        typedVerificationDocuments = [];
      }
      
      // Parse membership_plans from JSON to array
      let typedMembershipPlans: any[] = [];
      try {
        if (business.membership_plans) {
          if (typeof business.membership_plans === 'object' && Array.isArray(business.membership_plans)) {
            typedMembershipPlans = business.membership_plans as any[];
          } else if (typeof business.membership_plans === 'string') {
            typedMembershipPlans = JSON.parse(business.membership_plans);
          }
        }
      } catch (e) {
        console.error("Error parsing membership plans:", e);
        // Provide default empty array if parsing fails
        typedMembershipPlans = [];
      }
      
      return {
        ...business,
        owners: typedOwners,
        staff_details: typedStaffDetails,
        image_position: typedImagePosition,
        verification_documents: typedVerificationDocuments,
        membership_plans: typedMembershipPlans,
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

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);
        
      if (error) throw error;
      
      toast.success("Business deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business");
    }
  };

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

  const handleLayoutChange = (layout: GridLayoutType) => {
    setGridLayout(layout);
    localStorage.setItem("preferredBusinessGridLayout", layout);
  };

  const formatHours = (hours: string | BusinessHours | undefined): string => {
    if (!hours) return '';
    
    if (typeof hours === 'string') return hours;
    
    try {
      if (typeof hours === 'object') {
        return Object.entries(hours)
          .map(([day, time]) => {
            if (typeof time === 'object' && time !== null && 'open' in time && 'close' in time) {
              return `${day}: ${time.open} - ${time.close}`;
            } else if (typeof time === 'string') {
              return `${day}: ${time}`;
            }
            return `${day}: Closed`;
          })
          .join(', ');
      }
    } catch (e) {
      console.error("Error formatting hours:", e);
    }
    
    return '';
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-[1400px] mx-auto pt-20 pb-24 px-4 sm:px-6">
        {showCreateForm ? (
          <CreateBusinessForm 
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Header and Search */}
            <div className="container max-w-[1400px] mx-auto px-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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
                <AutocompleteSearch 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearchSelect={(query) => setSearchQuery(query)}
                  placeholder="Search for businesses, categories, or locations..."
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Banner Ad - Top placement */}
            <BusinessBannerAd />
            
            {/* Spotlight Section */}
            <LazySection title="Local Business Spotlight">
              <LocalBusinessSpotlight />
            </LazySection>
            
            {/* Rankings Section */}
            <LazySection title="Business Rankings">
              <BusinessRankingsSection />
            </LazySection>
            
            {/* Main Business Listings */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Businesses</h2>
                <GridLayoutSelector layout={gridLayout} onChange={handleLayoutChange} />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
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
                  className={cn(
                    "grid gap-4",
                    gridLayout === "grid2x2" && "grid-cols-1 sm:grid-cols-1 md:grid-cols-2",
                    gridLayout === "grid3x3" && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
                    gridLayout === "grid4x4" && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  )}
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
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (confirm("Are you sure you want to delete this business?")) {
                            handleDeleteBusiness(business.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <BusinessCard 
                        id={business.id}
                        name={business.name}
                        category={business.category}
                        description={business.description}
                        image={business.image_url || '/placeholder.svg'}
                        rating={business.average_rating || 0}
                        reviews={business.reviews_count || 0}
                        location={business.location || ''}
                        contact={business.contact || ''}
                        hours={formatHours(business.hours)}
                        verified={business.verified || false}
                        appointment_price={business.appointment_price}
                        consultation_price={business.consultation_price}
                        is_open={business.is_open}
                        wait_time={business.wait_time}
                        closure_reason={business.closure_reason}
                      />
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
        )}
      </div>
    </div>
  );
};

// Import the cn utility
import { cn } from "@/lib/utils";

export default Business;
