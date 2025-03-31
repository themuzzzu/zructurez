
import { Business } from '@/types/business';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { BookAppointmentDialog } from '@/components/BookAppointmentDialog';

interface BusinessServicesSectionProps {
  business: Business;
}

export const BusinessServicesSection = ({ business }: BusinessServicesSectionProps) => {
  const [bookingService, setBookingService] = useState<{
    name: string;
    cost: number;
  } | null>(null);

  const services = [
    business.appointment_price ? {
      name: "General Appointment",
      description: "Book a standard appointment with our business",
      price: business.appointment_price
    } : null,
    business.consultation_price ? {
      name: "Consultation",
      description: "Get expert consultation for your specific needs",
      price: business.consultation_price
    } : null
  ].filter(Boolean);

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <p className="text-muted-foreground text-center py-4">
            No services available for this business yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <div className="grid gap-4">
            {services.map((service, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{service?.name}</h4>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{service?.description}</p>
                  <p className="font-bold">₹{service?.price}</p>
                </div>
                <Button 
                  className="shrink-0 self-start sm:self-center"
                  onClick={() => service && setBookingService({
                    name: service.name,
                    cost: service.price
                  })}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {bookingService && (
        <BookAppointmentDialog
          businessId={business.id}
          businessName={business.name}
          serviceName={bookingService.name}
          cost={bookingService.cost}
          isOpen={!!bookingService}
          onClose={() => setBookingService(null)}
        />
      )}
    </>
  );
};
