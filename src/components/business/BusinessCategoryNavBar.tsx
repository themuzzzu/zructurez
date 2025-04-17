import React, { ElementType } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Home,
  ShoppingBag,
  Utensils,
  HeartPulse,
  Car,
  Shirt,
  Hammer,
  School,
  Hotel,
  Smartphone,
  Scissors,
  Dumbbell,
  HomeIcon,
} from "lucide-react";

interface BusinessCategoryNavBarProps {
  active?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

// Define the categories with their icons
const categories = [
  {
    id: "all",
    name: "All",
    icon: Home as unknown as ElementType,
    description: "Browse all categories",
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: ShoppingBag as unknown as ElementType,
    description: "Supermarkets & grocery stores",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: Utensils as unknown as ElementType,
    description: "Restaurants, cafes & eateries",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: HeartPulse as unknown as ElementType,
    description: "Doctors, clinics & pharmacies",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car as unknown as ElementType,
    description: "Car services & dealerships",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt as unknown as ElementType,
    description: "Clothing & fashion accessories",
  },
  {
    id: "services",
    name: "Services",
    icon: Hammer as unknown as ElementType,
    description: "Professional & general services",
  },
  {
    id: "education",
    name: "Education",
    icon: School as unknown as ElementType,
    description: "Schools, tutoring & courses",
  },
  {
    id: "accommodations",
    name: "Accommodations",
    icon: Hotel as unknown as ElementType,
    description: "Hotels, lodging & rentals",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Smartphone as unknown as ElementType,
    description: "Electronics & tech stores",
  },
  {
    id: "salon",
    name: "Salon",
    icon: Scissors as unknown as ElementType,
    description: "Beauty salons & barber shops",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell as unknown as ElementType,
    description: "Gyms, fitness centers & trainers",
  },
];

export function BusinessCategoryNavBar({
  active = "all",
  onCategoryChange,
  className,
}: BusinessCategoryNavBarProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { t } = useLanguage();

  const handleClick = (category: string) => {
    onCategoryChange?.(category);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className={cn("flex gap-2 py-2", isMobile ? "px-4" : "")}>
          {categories.map((category) => {
            const isActive = active === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleClick(category.id)}
                className="flex flex-col items-center py-2 h-auto px-4 gap-2"
                size="sm"
              >
                {React.createElement(category.icon, {
                  className: "h-5 w-5",
                  "aria-hidden": "true",
                })}
                <span className="text-xs whitespace-normal text-center">
                  {t(category.name.toLowerCase())}
                </span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
