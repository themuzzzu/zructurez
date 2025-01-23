import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (!product) return <ErrorView message="Product not found" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/marketplace">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{product.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
              {product.product_images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.product_images.map((image: { image_url: string }) => (
                    <img
                      key={image.image_url}
                      src={image.image_url}
                      alt={product.title}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-2xl font-bold">${product.price}</p>
                <p className="text-muted-foreground">{product.category}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.brand_name && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Brand</h2>
                  <p className="text-muted-foreground">{product.brand_name}</p>
                </div>
              )}

              {product.condition && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Condition</h2>
                  <p className="text-muted-foreground">{product.condition}</p>
                </div>
              )}

              <Button className="w-full">Add to Cart</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;