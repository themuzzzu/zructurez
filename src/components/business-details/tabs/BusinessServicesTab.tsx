import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookAppointmentDialog } from "@/components/BookAppointmentDialog";

interface BusinessServicesTabProps {
  appointmentPrice: number | null;
  consultationPrice: number | null;
  businessId: string;
  onSuccess?: () => void;
}

export const BusinessServicesTab = ({ 
  appointmentPrice, 
  consultationPrice,
  businessId,
  onSuccess 
}: BusinessServicesTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showInServices, setShowInServices] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    cost: number;
  } | null>(null);

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('show_in_services')
        .eq('id', businessId)
        .single();

      if (businessError) {
        console.error('Error fetching business settings:', businessError);
        return;
      }

      setShowInServices(businessData?.show_in_services || false);

      const { data: messageData, error: messageError } = await supabase
        .from('business_booking_messages')
        .select('message_template')
        .eq('business_id', businessId)
        .single();

      if (!messageError && messageData) {
        setBookingMessage(messageData.message_template);
      } else {
        const { error: insertError } = await supabase
          .from('business_booking_messages')
          .insert([{ business_id: businessId }]);

        if (insertError) {
          console.error('Error creating default message template:', insertError);
        }
      }
    };

    fetchBusinessSettings();
  }, [businessId]);

  const handleShowInServicesChange = async () => {
    const newValue = !showInServices;
    
    const { error } = await supabase
      .from('businesses')
      .update({ show_in_services: newValue })
      .eq('id', businessId);

    if (error) {
      toast.error("Failed to update setting");
      console.error('Error updating business setting:', error);
      return;
    }

    setShowInServices(newValue);
    toast.success("Setting updated successfully");
  };

  const handleBookingMessageChange = async () => {
    const { error } = await supabase
      .from('business_booking_messages')
      .update({ message_template: bookingMessage })
      .eq('business_id', businessId);

    if (error) {
      toast.error("Failed to update booking message");
      return;
    }

    toast.success("Booking message updated successfully");
  };

  const handleBookAppointment = (serviceName: string, cost: number) => {
    setSelectedService({ name: serviceName, cost });
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
        {appointmentPrice && (
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="font-medium">Appointment Price:</span> ₹{appointmentPrice}
            </div>
            <Button 
              onClick={() => handleBookAppointment("Regular Appointment", appointmentPrice)}
              variant="outline"
            >
              Book Appointment
            </Button>
          </div>
        )}
        {consultationPrice && (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Consultation Price:</span> ₹{consultationPrice}
            </div>
            <Button 
              onClick={() => handleBookAppointment("Consultation", consultationPrice)}
              variant="outline"
            >
              Book Consultation
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-in-services"
              checked={showInServices}
              onCheckedChange={handleShowInServicesChange}
            />
            <Label htmlFor="show-in-services">Show in Services Page</Label>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Booking Message Template</h3>
          <p className="text-sm text-muted-foreground">
            Customize the message sent to customers when they book an appointment.
            Available variables: {"{date}"}, {"{time}"}, {"{amount}"}, {"{token}"}
          </p>
          <Textarea
            value={bookingMessage}
            onChange={(e) => setBookingMessage(e.target.value)}
            rows={4}
            className="w-full"
          />
          <Button onClick={handleBookingMessageChange}>
            Update Message Template
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Services</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] h-[90vh]">
            <ScrollArea className="h-full pr-4">
              <CreateServiceForm 
                onSuccess={() => {
                  setIsDialogOpen(false);
                  onSuccess?.();
                }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {selectedService && (
          <BookAppointmentDialog
            businessId={businessId}
            businessName=""
            serviceName={selectedService.name}
            cost={selectedService.cost}
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedService(null);
            }}
          />
        )}
      </Card>
    </div>
  );
};
