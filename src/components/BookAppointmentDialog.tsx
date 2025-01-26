import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { AppointmentForm } from "./appointments/AppointmentForm";
import { generateQRCode } from "./appointments/QRCodeGenerator";
import { getOrCreateBookingMessage, formatBookingMessage } from "./appointments/BookingMessageService";

interface BookAppointmentDialogProps {
  businessId: string;
  businessName: string;
  serviceName: string;
  cost: number;
  isOpen: boolean;
  onClose: () => void;
}

export const BookAppointmentDialog = ({
  businessId,
  businessName,
  serviceName,
  cost,
  isOpen,
  onClose
}: BookAppointmentDialogProps) => {
  const [loading, setLoading] = useState(false);

  const generateToken = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = async (date: Date, time: string, notes: string) => {
    setLoading(true);
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(":");
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    const token = generateToken();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to book an appointment");
        return;
      }

      // Create the appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          business_id: businessId,
          user_id: user.id,
          appointment_date: appointmentDate.toISOString(),
          service_name: serviceName,
          cost: cost,
          notes: notes,
          token: token
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Generate QR code
      await generateQRCode({
        businessId,
        appointmentId: appointmentData.id,
        token: appointmentData.token,
        date: appointmentData.appointment_date,
        service: serviceName
      });

      // Get or create booking message template
      const messageTemplate = await getOrCreateBookingMessage(businessId);

      // Create notification with the customized message
      if (messageTemplate) {
        const formattedDate = appointmentDate.toLocaleDateString();
        const formattedTime = appointmentDate.toLocaleTimeString();
        
        const message = formatBookingMessage(
          messageTemplate,
          formattedDate,
          formattedTime,
          cost,
          token
        );

        await supabase.from('notifications').insert({
          user_id: user.id,
          message: message,
        });
      }

      toast.success("Appointment booked successfully!");
      onClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Book an appointment with {businessName} for {serviceName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
          <AppointmentForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};