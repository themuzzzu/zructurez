
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Sparkles, ThumbsUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ServiceCard } from "@/components/service-marketplace/ServiceCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

type SectionType = "trending" | "sponsored" | "suggested";

interface ServiceSectionProps {
  type: SectionType;
  category?: string;
  limit?: number;
  showCategories?: boolean;
}

export function ServiceSection({
  type,
  category,
  limit = 6,
  showCategories = true
}: ServiceSectionProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  
  // Get related categories for this section
  const { data: categories } = useQuery({
    queryKey: ['service-categories', type],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('category')
          .order('category', { ascending: true })
          .limit(8);
        
        const uniqueCategories = [...new Set(data?.map(item => item.category))];
        return uniqueCategories.map(cat => ({ id: cat, name: cat }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });
  
  // Get services based on section type
  const { data: services, isLoading } = useQuery({
    queryKey: ['services-section', type, selectedCategory, limit],
    queryFn: async () => {
      try {
        let query = supabase.from('services').select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        if (type === 'trending') {
          query = query.order('views', { ascending: false });
        } else if (type === 'sponsored') {
          // Mock sponsored services (in a real app, would have a sponsored field)
          query = query.order('price', { ascending: false });
        } else if (type === 'suggested') {
          query = query.order('created_at', { ascending: false });
        }
        
        const { data } = await query.limit(limit);
        return data || [];
      } catch (error) {
        console.error(`Error fetching ${type} services:`, error);
        return [];
      }
    }
  });
  
  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Define section title and icon based on type
  const sectionConfig = {
    trending: { 
      title: "Trending Services",
      icon: <TrendingUp className="h-4 w-4 text-red-500" />,
      viewAllLink: "/services?sort=trending"
    },
    sponsored: {
      title: "Sponsored Services",
      icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
      viewAllLink: "/services?filter=sponsored" 
    },
    suggested: {
      title: "Suggested Services",
      icon: <ThumbsUp className="h-4 w-4 text-blue-500" />,
      viewAllLink: "/services?filter=suggested"
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2 mb-4">
        <SectionHeader title={sectionConfig[type].title} icon={sectionConfig[type].icon} />
        <div className="h-32 animate-pulse bg-muted rounded-md" />
      </div>
    );
  }
  
  if (!services || services.length === 0) return null;
  
  return (
    <div className="space-y-3 mb-5">
      <SectionHeader 
        title={sectionConfig[type].title}
        icon={sectionConfig[type].icon}
        viewAllLink={sectionConfig[type].viewAllLink}
        relatedCategories={showCategories ? categories : []}
        onCategoryClick={handleCategoryClick}
      />
      
      <ScrollArea className="w-full pb-1">
        <div className="flex space-x-3 py-1">
          {services.map((service) => (
            <div key={service.id} className="flex-shrink-0 w-[180px] sm:w-[200px]">
              <ServiceCard 
                service={{
                  id: service.id,
                  title: service.title,
                  description: service.description,
                  price: service.price,
                  imageUrl: service.image_url,
                  category: service.category,
                  contact_info: service.contact_info
                }}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
