
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus } from "lucide-react";
import { useState } from "react";
import { useProductDeletion } from "@/hooks/useProductDeletion";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { ServiceProductForm } from "./ServiceProductForm";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ProductsTab = () => {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const { isDeleting, deleteProduct } = useProductDeletion(() => {
    refetch();
    setIsDeleteDialogOpen(false);
  });

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);

      return data || [];
    },
  });

  const handleDeleteProduct = () => {
    if (!selectedProductId) return;
    deleteProduct(selectedProductId);
  };
  
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsEditProductDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <Button onClick={() => setIsAddProductDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex flex-col h-full">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't added any products yet.</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddProductDialogOpen(true)} 
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone, and the product will be permanently removed from your catalog."
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
          <ServiceProductForm 
            serviceId=""
            onSuccess={() => {
              toast.success("Product added successfully");
              setIsAddProductDialogOpen(false);
              refetch();
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
            <ServiceProductForm 
              serviceId=""
              initialData={editingProduct}
              onSuccess={() => {
                toast.success("Product updated successfully");
                setIsEditProductDialogOpen(false);
                setEditingProduct(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
