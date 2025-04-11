
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Sparkles, ThumbsUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

type SectionType = "trending" | "sponsored" | "suggested";

interface MarketplaceSectionProps {
  type: SectionType;
  category?: string;
  limit?: number;
  showCategories?: boolean;
}

export function MarketplaceSection({
  type,
  category,
  limit = 6,
  showCategories = true
}: MarketplaceSectionProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  
  // Get related categories for this section
  const { data: categories } = useQuery({
    queryKey: ['marketplace-categories', type],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('products')
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
  
  // Get products based on section type
  const { data: products, isLoading } = useQuery({
    queryKey: ['marketplace-products', type, selectedCategory, limit],
    queryFn: async () => {
      try {
        let query = supabase.from('products').select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        // Apply specific filters based on section type
        if (type === 'trending') {
          query = query.order('views', { ascending: false });
        } else if (type === 'sponsored') {
          query = query.eq('is_branded', true);
        } else if (type === 'suggested') {
          // For suggested, we'd typically use user data, but for now let's use recency
          query = query.order('created_at', { ascending: false });
        }
        
        const { data } = await query.limit(limit);
        return data || [];
      } catch (error) {
        console.error(`Error fetching ${type} products:`, error);
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
      title: "Trending Products",
      icon: <TrendingUp className="h-4 w-4 text-red-500" />,
      viewAllLink: "/marketplace?sort=trending"
    },
    sponsored: {
      title: "Sponsored Products",
      icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
      viewAllLink: "/marketplace?filter=sponsored" 
    },
    suggested: {
      title: "Suggested For You",
      icon: <ThumbsUp className="h-4 w-4 text-blue-500" />,
      viewAllLink: "/marketplace?filter=suggested"
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
  
  if (!products || products.length === 0) return null;
  
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
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[140px] sm:w-[160px]">
              <ProductCard product={product} layout="compact" />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
