
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { AppointmentForm } from "./appointments/AppointmentForm";
import { generateQRCode } from "./appointments/QRCodeGenerator";
import { getOrCreateBookingMessage, formatBookingMessage } from "./appointments/BookingMessageService";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

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
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

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
      setShowRating(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          profile_id: profile.id,
          content: review,
          rating: rating
        });

      toast.success("Thank you for your review!");
      setShowRating(false);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[90vh]">
        {!showRating ? (
          <>
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rate Your Experience</DialogTitle>
              <DialogDescription>
                How would you rate your experience with {businessName}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review (optional)"
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Skip
                </Button>
                <Button onClick={handleRatingSubmit} disabled={!rating}>
                  Submit Review
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
