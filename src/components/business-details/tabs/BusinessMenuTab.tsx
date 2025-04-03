import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuType } from "@/types/menu";

interface BusinessMenuTabProps {
  businessId: string;
}

export const BusinessMenuTab = ({ businessId }: BusinessMenuTabProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: menuData, isLoading } = useQuery({
    queryKey: ['business-menu', businessId],
    queryFn: async () => {
      // Check if there's a published menu
      const { data: menu, error: menuError } = await supabase
        .from('business_menus')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_published', true)
        .maybeSingle();
        
      if (menuError) throw menuError;
      
      if (!menu) return null;
      
      // Get categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('business_id', businessId);
        
      if (categoriesError) throw categoriesError;
      
      // Get subcategories
      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('menu_subcategories')
        .select('*')
        .eq('business_id', businessId);
        
      if (subcategoriesError) throw subcategoriesError;
      
      // Get items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', businessId);
        
      if (itemsError) throw itemsError;
      
      return {
        menu,
        categories: categories || [],
        subcategories: subcategories || [],
        items: items || []
      };
    },
  });

  useEffect(() => {
    // Set the first category as active when data loads
    if (menuData?.categories?.length > 0 && !activeCategory) {
      setActiveCategory(menuData.categories[0].id);
    }
  }, [menuData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <p>Loading menu...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!menuData || !menuData.menu) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This business hasn't published a menu or list yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayType: MenuType = menuData.menu.display_type as MenuType || 'menu';

  // Group subcategories by category
  const categoriesWithSubcategories = menuData.categories.map(category => {
    const categorySubcategories = menuData.subcategories
      .filter(subcategory => subcategory.category_id === category.id)
      .map(subcategory => {
        const subcategoryItems = menuData.items
          .filter(item => item.subcategory_id === subcategory.id);
          
        return {
          ...subcategory,
          items: subcategoryItems
        };
      })
      .filter(subcat => subcat.items.length > 0); // Only show subcategories with items
    
    return {
      ...category,
      subcategories: categorySubcategories
    };
  }).filter(cat => cat.subcategories.length > 0); // Only show categories with subcategories that have items

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>
          {displayType === 'menu' ? 'Menu' : 'List'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {categoriesWithSubcategories.length > 0 ? (
          <div className="space-y-6">
            {categoriesWithSubcategories.length > 1 && (
              <Tabs value={activeCategory || ""} onValueChange={setActiveCategory}>
                <TabsList className="w-full border-b flex flex-wrap">
                  {categoriesWithSubcategories.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            
            <ScrollArea className="pr-4 h-[60vh]">
              {categoriesWithSubcategories
                .filter(category => !activeCategory || category.id === activeCategory)
                .map(category => (
                  <div key={category.id} className="space-y-8">
                    {categoriesWithSubcategories.length > 1 && (
                      <h3 className="text-xl font-semibold border-b pb-2">{category.name}</h3>
                    )}
                    
                    {category.subcategories.map(subcategory => (
                      <div key={subcategory.id} className="space-y-4">
                        <h4 className="text-lg font-medium">{subcategory.name}</h4>
                        
                        <div className="space-y-4">
                          {subcategory.items.map(item => (
                            <div key={item.id} className="flex items-start justify-between">
                              <div className="flex gap-3">
                                {item.image_url && (
                                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.image_url} 
                                      alt={item.name}
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}
                                
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-medium">{item.name}</h5>
                                    {item.availability === 'out_of_stock' && (
                                      <Badge variant="outline" className="text-destructive border-destructive">
                                        Out of Stock
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              {item.price && (
                                <p className="font-semibold whitespace-nowrap">
                                  {item.price_unit}{item.price}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                ))}
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No menu items available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
