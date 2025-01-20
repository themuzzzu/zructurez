import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ServiceMenuCardProps {
  category?: string;
  appointment_price?: number;
  consultation_price?: number;
  business_products?: Array<{
    name: string;
    price: number;
    description: string;
    category?: string; // Added category for products
  }>;
}

export const ServiceMenuCard = ({
  category,
  appointment_price,
  consultation_price,
  business_products,
}: ServiceMenuCardProps) => {
  // Group products by category
  const groupedProducts = business_products?.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof business_products>);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Menu className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Details of Business</h3>
      </div>

      {category && (
        <div className="mb-4">
          <span className="text-sm font-medium">Category:</span>
          <span className="ml-2 text-muted-foreground capitalize">{category}</span>
        </div>
      )}

      {(appointment_price || consultation_price) && (
        <div className="space-y-2 mb-4">
          {appointment_price && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Appointment</span>
              <span className="font-medium">₹{appointment_price}</span>
            </div>
          )}
          {consultation_price && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Consultation</span>
              <span className="font-medium">₹{consultation_price}</span>
            </div>
          )}
        </div>
      )}

      {groupedProducts && Object.keys(groupedProducts).length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-6">
            <h4 className="font-medium">Featured Items</h4>
            {Object.entries(groupedProducts).map(([category, products]) => (
              <div key={category} className="space-y-3">
                <h5 className="text-sm font-medium capitalize text-muted-foreground">
                  {category}
                </h5>
                <div className="space-y-2">
                  {products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-muted-foreground">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};