
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductLikeButton } from "./products/ProductLikeButton";

interface ShoppingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  category?: string;
  type?: 'marketplace' | 'business' | 'service';
}

export function ShoppingCard({
  id,
  title,
  description,
  image,
  price,
  category,
  type = 'marketplace',
}: ShoppingCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Ensure we're using the correct route based on product type
    if (type === 'marketplace') {
      navigate(`/product/${id}`);
    } else if (type === 'business') {
      navigate(`/businesses/${id}`);
    } else if (type === 'service') {
      navigate(`/services/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md" onClick={handleClick}>
      <CardContent className="p-0">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Eye className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          )}
        </AspectRatio>
      </CardContent>
      <CardContent className="p-3">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <ProductLikeButton productId={id} size="sm" variant="ghost" />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-medium text-sm">{price}</div>
          {category && (
            <Badge variant="secondary" className="text-xs font-normal px-1.5 py-0">
              {category}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
