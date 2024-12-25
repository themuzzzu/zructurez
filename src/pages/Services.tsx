import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCategoryFilter } from "@/components/ServiceCategoryFilter";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Services = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, profiles(username, avatar_url)')
        .eq('profiles.id', 'user_id');

      if (error) {
        toast.error("Failed to load services");
        throw error;
      }

      return data || [];
    }
  });

  const filteredServices = services?.filter(service => 
    (selectedCategory === "all" || service.category.toLowerCase() === selectedCategory.toLowerCase()) &&
    (searchQuery === "" || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
              <h1 className="text-3xl font-bold animate-fade-up">Local Services</h1>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Cancel" : "List a Service"}
            </Button>
          </div>

          {showCreateForm ? (
            <CreateServiceForm onSuccess={() => setShowCreateForm(false)} />
          ) : (
            <>
              <div className="flex flex-col gap-6">
                <SearchInput
                  placeholder="Search services by name, description, or category..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="max-w-xl"
                />
                <ServiceCategoryFilter onCategoryChange={handleCategoryChange} />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredServices?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices?.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.title}
                      provider={service.profiles?.username || "Anonymous"}
                      avatar={service.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.user_id}`}
                      category={service.category}
                      rating={4.5}
                      reviews={0}
                      description={service.description}
                      image={service.image_url || "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800"}
                      hourlyRate={service.price}
                      location={service.location || "Location not specified"}
                      availability={service.availability || "Contact for availability"}
                    />
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

export default Services;