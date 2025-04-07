
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SponsoredProductsProps {
  limit?: number;
  showTitle?: boolean;
}

export const SponsoredProducts = ({
  limit = 4,
  showTitle = true
}: SponsoredProductsProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["sponsored-products"],
    queryFn: async () => {
      try {
        // In a real app, we would have a sponsored field
        // For now, fetch top products as a proxy for sponsored
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("views", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching sponsored products:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Products
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      {showTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Products
            </CardTitle>
            <Link to="/marketplace">
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <Badge 
                className="absolute top-2 right-2 bg-yellow-500/90 text-white text-xs"
                variant="secondary"
              >
                Sponsored
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
