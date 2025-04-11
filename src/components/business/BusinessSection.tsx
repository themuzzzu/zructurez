
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Sparkles, ThumbsUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Business } from "@/types/business";

type SectionType = "trending" | "sponsored" | "suggested";

interface BusinessSectionProps {
  type: SectionType;
  category?: string;
  limit?: number;
  showCategories?: boolean;
}

export function BusinessSection({
  type,
  category,
  limit = 6,
  showCategories = true
}: BusinessSectionProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  
  // Get related categories for this section
  const { data: categories } = useQuery({
    queryKey: ['business-categories', type],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('businesses')
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
  
  // Get businesses based on section type
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses-section', type, selectedCategory, limit],
    queryFn: async () => {
      try {
        let query = supabase
          .from('businesses')
          .select('*, business_ratings(*)');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        // Apply specific filters based on section type
        if (type === 'trending') {
          // Mock trending with ratings
          const { data } = await query.limit(limit * 2);
          if (!data) return [];
          
          // Calculate average rating and sort
          return data
            .map(business => {
              const ratings = business.business_ratings || [];
              const totalRating = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
              const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
              
              return {
                ...business,
                average_rating: averageRating,
                reviews_count: ratings.length
              };
            })
            .sort((a, b) => b.average_rating - a.average_rating)
            .slice(0, limit);
        } else if (type === 'sponsored') {
          query = query.eq('verified', true);
        } else if (type === 'suggested') {
          // For suggested, use recently added
          query = query.order('created_at', { ascending: false });
        }
        
        const { data } = await query.limit(limit);
        if (!data) return [];
        
        // Calculate ratings for non-trending sections
        return data.map(business => {
          const ratings = business.business_ratings || [];
          const totalRating = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
          const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
          
          return {
            ...business,
            average_rating: averageRating,
            reviews_count: ratings.length
          };
        });
      } catch (error) {
        console.error(`Error fetching ${type} businesses:`, error);
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
      title: "Trending Businesses",
      icon: <TrendingUp className="h-4 w-4 text-red-500" />,
      viewAllLink: "/businesses?sort=trending"
    },
    sponsored: {
      title: "Sponsored Businesses",
      icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
      viewAllLink: "/businesses?filter=sponsored" 
    },
    suggested: {
      title: "Suggested Businesses",
      icon: <ThumbsUp className="h-4 w-4 text-blue-500" />,
      viewAllLink: "/businesses?filter=suggested"
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
  
  if (!businesses || businesses.length === 0) return null;
  
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
          {businesses.map((business) => (
            <div key={business.id} className="flex-shrink-0 w-[200px] sm:w-[220px]">
              <BusinessCard 
                id={business.id}
                name={business.name}
                category={business.category}
                description={business.description || ""}
                image={business.image_url || '/placeholder.svg'}
                rating={business.average_rating || 0}
                reviews={business.reviews_count || 0}
                location={business.location || ''}
                contact={business.contact || ''}
                hours={business.hours || ''}
                verified={business.verified || false}
                appointment_price={business.appointment_price}
                consultation_price={business.consultation_price}
                is_open={business.is_open}
                wait_time={business.wait_time}
                closure_reason={business.closure_reason}
                size="small"
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
