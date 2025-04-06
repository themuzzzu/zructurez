
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImageFallback } from "@/components/ui/image-fallback";

// Service categories with appropriate images
const serviceCategories = [
  {
    id: "home",
    name: "Home Services",
    icon: "home",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=300&q=80",
    color: "bg-blue-500"
  },
  {
    id: "tech",
    name: "Tech Support",
    icon: "laptop",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80",
    color: "bg-purple-500"
  },
  {
    id: "health",
    name: "Healthcare",
    icon: "heart",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=300&q=80",
    color: "bg-red-500"
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: "sparkles",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=300&q=80",
    color: "bg-pink-500"
  },
  {
    id: "education",
    name: "Education & Tutoring",
    icon: "book-open",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80",
    color: "bg-yellow-500"
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: "scale",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=300&q=80",
    color: "bg-indigo-500"
  },
  {
    id: "financial",
    name: "Financial Services",
    icon: "trending-up",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=300&q=80",
    color: "bg-green-500"
  },
  {
    id: "events",
    name: "Event Planning",
    icon: "calendar",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=300&q=80",
    color: "bg-orange-500"
  }
];

export const ServiceCategoryGrid = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {serviceCategories.map((category) => (
        <Card 
          key={category.id}
          className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className="relative h-24 sm:h-28">
            <ImageFallback
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              aspectRatio="square"
              fallbackSrc="/placeholders/image-placeholder.jpg"
            />
            <div className={cn("absolute inset-0 opacity-60", category.color)} />
          </div>
          <CardContent className="p-3 text-center">
            <p className="font-medium text-sm">{category.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
