
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

interface AIPricingTableProps {
  inventoryData: any[];
  isLoading: boolean;
}

export const AIPricingTable = ({ 
  inventoryData, 
  isLoading 
}: AIPricingTableProps) => {
  // Generate AI price recommendations based on product data
  const pricingRecommendations = useMemo(() => {
    if (!inventoryData.length) return [];
    
    return inventoryData.map(product => {
      // Simple pricing algorithm based on views, stock, and market position
      const viewsMultiplier = ((product.views || 0) + 1) / 100;
      const stockFactor = product.stock < 5 ? 1.05 : product.stock > 20 ? 0.95 : 1;
      const randomMarketFactor = 0.9 + (Math.random() * 0.2); // Simulates market conditions
      
      const recommendedPrice = product.price * viewsMultiplier * stockFactor * randomMarketFactor;
      const priceDiff = recommendedPrice - product.price;
      const percentChange = (priceDiff / product.price) * 100;
      
      // Generate a reason for the recommendation
      let reason;
      if (product.stock < 5 && priceDiff > 0) {
        reason = "Low stock, high demand";
      } else if (product.stock > 20 && priceDiff < 0) {
        reason = "High stock, optimize for volume";
      } else if (product.views > 100 && priceDiff > 0) {
        reason = "High product views, market opportunity";
      } else if (priceDiff > 0) {
        reason = "Market analysis suggests higher value";
      } else {
        reason = "Price adjustment to increase competitiveness";
      }
      
      return {
        ...product,
        recommendedPrice: Math.round(recommendedPrice * 100) / 100,
        priceDiff,
        percentChange,
        reason
      };
    }).sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
  }, [inventoryData]);
  
  const handleApplyPrice = (productId: string, newPrice: number) => {
    toast.success(`Price updated to ₹${newPrice} for product ID: ${productId}`);
  };
  
  if (isLoading) {
    return <p>Loading pricing recommendations...</p>;
  }
  
  if (pricingRecommendations.length === 0) {
    return <p>No products available for price optimization</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Recommended Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>AI Reasoning</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pricingRecommendations.map(product => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.title}</TableCell>
            <TableCell>₹{product.price}</TableCell>
            <TableCell>₹{product.recommendedPrice}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {product.percentChange > 0 ? (
                  <>
                    <ArrowUp className="text-green-500 h-4 w-4" />
                    <span className="text-green-500">{Math.abs(product.percentChange).toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="text-red-500 h-4 w-4" />
                    <span className="text-red-500">{Math.abs(product.percentChange).toFixed(1)}%</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{product.reason}</Badge>
            </TableCell>
            <TableCell>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleApplyPrice(product.id, product.recommendedPrice)}
              >
                Apply
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
