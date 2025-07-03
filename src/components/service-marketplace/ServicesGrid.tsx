
import React from "react";
import { ServiceCard } from "./ServiceCard";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface Service {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  price?: number;
  rating?: number;
  location?: string;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

interface ServicesGridProps {
  services: Service[];
  gridLayout: GridLayoutType;
}

export const ServicesGrid = ({ services, gridLayout }: ServicesGridProps) => {
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid1x1":
        return "grid-cols-1";
      case "grid2x2":
        return "grid-cols-1 md:grid-cols-2";
      case "grid3x3":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case "grid4x4":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case "list":
        return "grid-cols-1 gap-2";
      case "single":
        return "grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className={`grid gap-6 ${getGridClasses()}`}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          layout={gridLayout}
        />
      ))}
    </div>
  );
};
