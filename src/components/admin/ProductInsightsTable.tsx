
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductInsightsTable() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-product-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    }
  });
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Conversion Rate</TableHead>
            <TableHead>Ad Potential</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No product data available
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              // Calculate a mock conversion rate based on views
              const mockConversionRate = ((Math.random() * 5) + 0.5).toFixed(1);
              
              // Calculate ad potential score (0-100)
              const viewsScore = Math.min(product.views || 0, 1000) / 10;
              const priceScore = Math.min(product.price, 10000) / 100;
              const adPotentialScore = Math.min(Math.round(viewsScore + priceScore), 100);
              
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.image_url && (
                        <div className="h-8 w-8 rounded overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <span className="truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.views || 0}</TableCell>
                  <TableCell>{mockConversionRate}%</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${adPotentialScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-1">{adPotentialScore}/100</span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
