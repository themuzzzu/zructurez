
import { ServiceCard } from "./ServiceCard";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

type GridLayout = "grid2x2" | "grid3x3" | "grid4x4" | "list";

interface ServicesGridProps {
  services: Service[];
  layout?: GridLayout;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  services, 
  layout = "grid3x3" 
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "grid3x3":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "list":
        return "flex flex-col gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };

  return (
    <div className={cn(getLayoutClasses())}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
