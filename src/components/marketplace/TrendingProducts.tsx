
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { GridLayoutType } from "@/components/products/types/layouts";
import { getTrendingProducts } from "@/services/rankingService";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/utils/productUtils";
import { RankingMetrics } from "@/types/subscription";

interface TrendingProductsProps {
  limit?: number;
  showTitle?: boolean;
  showAll?: boolean;
  title?: string;
  gridLayout?: GridLayoutType;
  className?: string;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  limit = 6,
  showTitle = true,
  showAll = true,
  title = "Trending Products",
  gridLayout = "grid3x3",
  className = "",
}) => {
  const navigate = useNavigate();

  const { data: trendingProducts, isLoading } = useQuery({
    queryKey: ["trendingProducts", limit],
    queryFn: () => getTrendingProducts(limit),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (!trendingProducts || trendingProducts.length === 0) {
    return null;
  }

  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      case "grid3x3":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        {showTitle && (
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
        )}
        {showAll && (
          <Button variant="ghost" size="sm" onClick={() => navigate("/rankings")}>
            View Rankings
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <motion.div
          className={getGridClasses()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {trendingProducts.map((product: RankingMetrics, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard
                product={{
                  id: product.id,
                  title: product.title || "",
                  name: product.name || "",
                  price: product.price || 0,
                  description: product.description || "",
                  category: product.category || "",
                  image_url: product.image_url || "",
                  views: product.views || 0,
                  badge: product.badge,
                  rank: product.rank
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
