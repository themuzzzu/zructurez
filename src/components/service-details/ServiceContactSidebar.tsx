import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ServiceContactSidebarProps {
  price: number;
  contactInfo?: string;
  providerName: string;
  providerAvatar: string;
  userId: string;
  onBookAppointment: () => void;
}

export const ServiceContactSidebar = ({
  price,
  contactInfo,
  providerName,
  providerAvatar,
  userId,
  onBookAppointment
}: ServiceContactSidebarProps) => {
  const handleContact = () => {
    if (contactInfo) {
      if (contactInfo.includes('@')) {
        window.location.href = `mailto:${contactInfo}`;
      } else {
        window.location.href = `tel:${contactInfo}`;
      }
    } else {
      toast.error("No contact information available");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="text-2xl font-bold">₹{price}</div>
        <div className="space-y-2">
          <Button className="w-full" onClick={handleContact}>
            Contact Service Provider
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onBookAppointment}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
        <div className="space-y-2">
          {contactInfo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {contactInfo.includes('@') ? (
                <Mail className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              {contactInfo}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Service Provider</h3>
        <div className="flex items-center gap-3">
          <img
            src={providerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
            alt="Provider"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{providerName || "Anonymous"}</div>
            <div className="text-sm text-muted-foreground">Service Provider</div>
          </div>
        </div>
      </Card>
    </div>
  );
};