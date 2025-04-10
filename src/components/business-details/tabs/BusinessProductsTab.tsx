
import { BusinessContent } from "@/components/business-details/BusinessContent";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo, useEffect } from "react";
import type { Business, BusinessProduct } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { BusinessProductForm } from "@/components/settings/BusinessProductForm";
import { useProductDeletion } from "@/hooks/useProductDeletion";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Standard product categories that most businesses would use
const PRODUCT_CATEGORIES = [
  { value: "all", label: "All Categories", icon: "layers" },
  { value: "food", label: "Food & Beverages", icon: "utensils" },
  { value: "electronics", label: "Electronics", icon: "smartphone" },
  { value: "fashion", label: "Fashion & Apparel", icon: "shirt" },
  { value: "health", label: "Health & Beauty", icon: "heart" },
  { value: "home", label: "Home & Decor", icon: "home" },
  { value: "toys", label: "Toys & Games", icon: "toy" },
  { value: "sports", label: "Sports & Outdoors", icon: "dumbbell" },
  { value: "books", label: "Books & Media", icon: "book-open" },
  { value: "art", label: "Art & Crafts", icon: "palette" },
  { value: "jewelry", label: "Jewelry & Accessories", icon: "gem" },
  { value: "other", label: "Other", icon: "more-horizontal" },
  { value: "uncategorized", label: "Uncategorized", icon: "help-circle" }
];

interface BusinessProductsTabProps {
  businessId: string;
  isOwner: boolean;
  products: Business['business_products'];
  onSuccess: () => void;
}

export const BusinessProductsTab = ({ businessId, isOwner, products, onSuccess }: BusinessProductsTabProps) => {
  // Group products by category
  const productCategories = useMemo(() => {
    const categories = new Set<string>();
    
    // Add "All" category and extract unique categories
    categories.add("all");
    products?.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      } else {
        categories.add("uncategorized");
      }
    });
    
    // Sort categories to match the predefined order
    const sortedCategories = Array.from(categories).sort((a, b) => {
      const aIndex = PRODUCT_CATEGORIES.findIndex(c => c.value === a);
      const bIndex = PRODUCT_CATEGORIES.findIndex(c => c.value === b);
      return aIndex - bIndex;
    });
    
    return sortedCategories;
  }, [products]);
  
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null);
  
  const { isDeleting, deleteProduct } = useProductDeletion(() => {
    onSuccess();
    setIsDeleteDialogOpen(false);
  });

  const handleDeleteProduct = () => {
    if (!selectedProductId) return;
    deleteProduct(selectedProductId, true);
  };
  
  const handleEditProduct = async (product: BusinessProduct) => {
    setEditingProduct(product);
    setIsEditProductDialogOpen(true);
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct?.id) return;
    
    try {
      const { error } = await supabase
        .from('business_products')
        .update({
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock),
          image_url: productData.image_url || editingProduct.image_url,
          category: productData.category || null
        })
        .eq('id', editingProduct.id);
        
      if (error) throw error;
      
      toast.success("Product updated successfully");
      setIsEditProductDialogOpen(false);
      setEditingProduct(null);
      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }
    
    if (activeCategory === "uncategorized") {
      return products?.filter(product => !product.category);
    }
    
    return products?.filter(product => product.category === activeCategory);
  }, [products, activeCategory]);

  const getCategoryLabel = (value: string) => {
    const category = PRODUCT_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        
        {isOwner && (
          <Button onClick={() => setIsAddProductDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>
      
      {productCategories.length > 1 && (
        <div className="mb-4 border border-border/30 rounded-md p-1">
          <ScrollArea className="pb-1 scrollbar-none">
            <TabsList className="flex w-full min-w-fit bg-transparent justify-start">
              {productCategories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className={`transition-all duration-300 px-3 py-1.5 text-xs sm:text-sm rounded-md ${
                    activeCategory === category ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {getCategoryLabel(category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>
      )}
      
      {isOwner && filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex flex-col h-full">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {product.category && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {getCategoryLabel(product.category)}
                    </span>
                  )}
                </div>
                
                <p className="font-medium mb-3">${product.price}</p>
                <div className="mt-auto pt-3 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <BusinessContent
          business={{ 
            id: businessId,
            name: "", 
            description: "",
            category: "",
            user_id: "",
            created_at: new Date().toISOString() 
          }}
          business_products={filteredProducts}
          business_portfolio={[]}
          onSuccess={onSuccess}
          activeCategory={activeCategory !== "all" && activeCategory !== "uncategorized" ? activeCategory : undefined}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone, and the product will be permanently removed from your business."
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProduct}
      />

      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <BusinessProductForm 
            businessId={businessId}
            onSuccess={() => {
              setIsAddProductDialogOpen(false);
              onSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <BusinessProductForm 
              businessId={businessId}
              product={editingProduct}
              onSuccess={() => {
                setIsEditProductDialogOpen(false);
                setEditingProduct(null);
                onSuccess();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
