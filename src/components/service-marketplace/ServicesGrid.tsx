
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
        return "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full";
      case "grid3x3":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full";
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full";
      case "list":
        return "flex flex-col gap-3 sm:gap-4 w-full";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full";
    }
  };

  return (
    <div className={cn(getLayoutClasses(), "overflow-hidden")}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
