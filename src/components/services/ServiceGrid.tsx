
import React from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/productUtils";

interface ServiceGridProps {
  services: any[];
  isLoading: boolean;
  layout: GridLayoutType;
  onLayoutChange: (layout: GridLayoutType) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  isLoading,
  layout = "grid3x3",
  onLayoutChange
}) => {
  const getGridClass = () => {
    switch (layout) {
      case "grid1x1":
        return "grid-cols-1";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2";
      case "grid4x4":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "grid3x3":
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">All Services</h2>
          <GridLayoutSelector layout={layout} onChange={onLayoutChange} />
        </div>
        <div className={cn("grid gap-4", getGridClass())}>
          {Array(6).fill(null).map((_, i) => (
            <ShoppingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">All Services</h2>
          <GridLayoutSelector layout={layout} onChange={onLayoutChange} />
        </div>
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-xl font-medium mb-2">No Services Found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Services</h2>
        <GridLayoutSelector layout={layout} onChange={onLayoutChange} />
      </div>
      <div className={cn("grid gap-4", getGridClass())}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            name={service.title}
            description={service.description}
            image={service.image_url}
            price={formatPrice(service.price)}
            providerName={service.provider_name || "Service Provider"}
            providerId={service.user_id || ""}
          />
        ))}
      </div>
    </div>
  );
};
