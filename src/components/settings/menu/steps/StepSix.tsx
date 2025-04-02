
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MenuType } from "@/types/menu";

interface StepSixProps {
  formData: {
    displayType: MenuType;
    businessName: string;
    businessLocation: string;
    categories: Array<{id: string, name: string, is_custom: boolean}>;
    subcategories: Array<{id: string, categoryId: string, name: string}>;
    items: Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      priceUnit: string;
      imageUrl: string;
      availability: 'in_stock' | 'out_of_stock';
      subcategoryId: string;
    }>;
  };
}

export const StepSix = ({ formData }: StepSixProps) => {
  // Group items by category and subcategory
  const groupedItems = formData.categories.map(category => {
    const categorySubcategories = formData.subcategories
      .filter(subcat => subcat.categoryId === category.id)
      .map(subcategory => {
        const subcategoryItems = formData.items
          .filter(item => item.subcategoryId === subcategory.id);
        
        return {
          ...subcategory,
          items: subcategoryItems
        };
      })
      .filter(subcat => subcat.items.length > 0); // Only include subcategories with items
    
    return {
      ...category,
      subcategories: categorySubcategories
    };
  }).filter(cat => cat.subcategories.length > 0); // Only include categories with subcategories containing items

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Preview Your {formData.displayType === 'menu' ? 'Menu' : 'List'}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Review how your {formData.displayType === 'menu' ? 'menu' : 'list'} will appear to customers.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{formData.businessName}</CardTitle>
            {formData.businessLocation && (
              <p className="text-sm text-muted-foreground">{formData.businessLocation}</p>
            )}
          </CardHeader>
          <CardContent>
            {groupedItems.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-8">
                  {groupedItems.map(category => (
                    <div key={category.id} className="space-y-4">
                      <h3 className="text-xl font-semibold border-b pb-2">{category.name}</h3>
                      
                      {category.subcategories.map(subcategory => (
                        <div key={subcategory.id} className="space-y-4">
                          <h4 className="text-lg font-medium">{subcategory.name}</h4>
                          
                          <div className="space-y-4">
                            {subcategory.items.map(item => (
                              <div key={item.id} className="flex items-start justify-between">
                                <div className="flex gap-3">
                                  {item.imageUrl && (
                                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                      <img 
                                        src={item.imageUrl} 
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
                                    {item.priceUnit}{item.price}
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
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No items added yet. Go back to add some items to your {formData.displayType === 'menu' ? 'menu' : 'list'}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Ready to Publish?</h4>
          <p className="text-sm text-muted-foreground">
            Once you publish, your {formData.displayType === 'menu' ? 'menu' : 'list'} will be visible on your business page.
            You can still make changes after publishing.
          </p>
        </div>
      </div>
    </div>
  );
};
