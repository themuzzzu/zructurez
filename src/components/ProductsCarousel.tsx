
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ShoppingCard } from "./ShoppingCard";
import { formatPrice } from "@/utils/productUtils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
  original_price?: number;
  is_discounted?: boolean;
  category?: string;
}

interface ProductsCarouselProps {
  products: Product[];
  title?: string;
}

export const ProductsCarousel = ({ products, title }: ProductsCarouselProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollLeft += 300;
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="w-full" ref={scrollAreaRef}>
        <div className="flex space-x-4 pb-4">
          {products.map((product) => (
            <div key={product.id} className="w-[260px] flex-shrink-0">
              <ShoppingCard
                id={product.id}
                title={product.name}
                description={product.description || ""}
                image={product.image_url}
                price={formatPrice(product.price)}
                originalPrice={
                  product.original_price ? formatPrice(product.original_price) : undefined
                }
                discountPercentage={product.discount_percentage}
                category={product.category}
                type="marketplace"
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={scrollRight}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
