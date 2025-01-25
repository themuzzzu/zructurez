import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import QRCode from "qrcode";

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateToken = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const generateQRCode = async (appointmentData: any) => {
    try {
      const qrData = JSON.stringify({
        businessId,
        appointmentId: appointmentData.id,
        token: appointmentData.token,
        date: appointmentData.appointment_date,
        service: serviceName
      });
      
      return await QRCode.toDataURL(qrData);
    } catch (err) {
      console.error("Error generating QR code:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }

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
      const qrCodeUrl = await generateQRCode(appointmentData);

      // Get the booking message template
      const { data: messageTemplate } = await supabase
        .from('business_booking_messages')
        .select('message_template')
        .eq('business_id', businessId)
        .single();

      // Create notification with the customized message
      if (messageTemplate) {
        const formattedDate = appointmentDate.toLocaleDateString();
        const formattedTime = appointmentDate.toLocaleTimeString();
        
        let message = messageTemplate.message_template
          .replace('{date}', formattedDate)
          .replace('{time}', formattedTime)
          .replace('{amount}', `$${cost}`)
          .replace('{token}', token);

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};