import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { CreateProductForm } from "./settings/CreateProductForm";
import { ProductCard } from "./products/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ShoppingSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogTitle>Add New Product</DialogTitle>
          <ScrollArea className="h-full pr-4">
            <CreateProductForm 
              onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
              }} 
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found. Add your first product!</p>
        </div>
      )}
    </div>
  );
};