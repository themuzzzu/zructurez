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
  }>;
}

export const ServiceMenuCard = ({
  category,
  appointment_price,
  consultation_price,
  business_products,
}: ServiceMenuCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Menu className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Service Menu</h3>
      </div>

      {category && (
        <div className="mb-4">
          <span className="text-sm font-medium">Category:</span>
          <span className="ml-2 text-muted-foreground">{category}</span>
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

      {business_products && business_products.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="font-medium">Featured Items</h4>
            <div className="space-y-3">
              {business_products.map((product, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">₹{product.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};