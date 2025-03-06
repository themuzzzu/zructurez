
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const ProductsList = () => {
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (!products?.length) {
    return <div className="text-center text-muted-foreground">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4 overflow-hidden">
          {product.image_url && (
            <div className="aspect-square overflow-hidden rounded-md mb-3">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h3 className="font-semibold text-sm line-clamp-1">{product.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">₹{product.price}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(product.id)}
                className="h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
