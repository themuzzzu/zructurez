
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { CreateServiceForm } from "@/components/service-form/CreateServiceForm";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/common/Spinner";
import { Layout } from "@/components/layout/Layout";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { SearchInput } from "@/components/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ServiceBannerCarousel } from "@/components/services/ServiceBannerCarousel";
import { SponsoredServices } from "@/components/service-marketplace/SponsoredServices";
import { TrendingServices } from "@/components/service-marketplace/TrendingServices";
import { SuggestedServices } from "@/components/service-marketplace/SuggestedServices";
import { ServiceCategoryFilter } from "@/components/ServiceCategoryFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the service type
interface ServiceType {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  user_id: string;
  category?: string;
  location?: string;
  views?: number;
  contact_info?: string;
  created_at?: string;
}

export default function Services() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid3x3");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(subcategoryParam ? `${categoryParam}-${subcategoryParam}` : categoryParam);
    }
  }, [location.search]);
  
  const checkUserAuth = async () => {
    const { data } = await supabase.auth.getUser();
    setIsUserLoggedIn(!!data.user);
  };
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
        
      const { data, error } = await query.limit(12);
        
      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkUserAuth();
    fetchServices();
  }, [selectedCategory, searchQuery]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === "all") {
      navigate("/services");
    } else {
      navigate(`/services?category=${category}`);
    }
  };
  
  const handleSubcategorySelect = (category: string, subcategory?: string) => {
    const newCategory = subcategory ? `${category}-${subcategory}` : category;
    setSelectedCategory(newCategory);
    
    if (subcategory) {
      navigate(`/services?category=${category}&subcategory=${subcategory}`);
    } else {
      navigate(`/services?category=${category}`);
    }
  };

  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
    fetchServices();
    checkUserAuth();
  };

  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      case "single":
        return "grid grid-cols-1 gap-4 max-w-3xl mx-auto";
      case "grid3x3":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case "oldest":
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name-asc":
        return (a.title || '').localeCompare(b.title || '');
      case "name-desc":
        return (b.title || '').localeCompare(a.title || '');
      default:
        return 0;
    }
  });

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
            <h1 className="text-2xl sm:text-3xl font-bold">Services Marketplace</h1>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
            {isUserLoggedIn && (
              <Button onClick={() => setIsDialogOpen(true)} className="ml-auto sm:ml-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Service
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput 
            placeholder="Search for services..." 
            value={searchQuery} 
            onChange={setSearchQuery} 
            className="w-full max-w-3xl mx-auto"
          />
        </div>
        
        {/* Banner with Auto Scroll */}
        <ServiceBannerCarousel />
        
        {/* Sponsored Services Section with Layout Selector */}
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sponsored Services</h2>
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
          </div>
          <SponsoredServices layout={gridLayout} />
        </div>
        
        {/* Trending Services with Layout Selector */}
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Trending Services</h2>
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
          </div>
          <TrendingServices layout={gridLayout} />
        </div>
        
        {/* Suggested Services with Layout Selector */}
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Suggested For You</h2>
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
          </div>
          <SuggestedServices layout={gridLayout} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">All Services</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <ServiceCategoryFilter onCategoryChange={handleCategoryChange} />
            <div className="w-full md:w-64">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : sortedServices.length > 0 ? (
            <div className={getGridClasses()}>
              {sortedServices.map((service) => (
                <ServiceCard 
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  image_url={service.image_url}
                  price={service.price}
                  providerId={service.user_id}
                  category={service.category}
                  location={service.location}
                  views={service.views}
                  contact_info={service.contact_info}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found</p>
            </div>
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create a New Service</h2>
            <CreateServiceForm onSuccess={handleCreateSuccess} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
