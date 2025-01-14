import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Fetch the current setting when component mounts
  useEffect(() => {
    const fetchBusinessSettings = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('show_in_services')
        .eq('id', businessId)
        .single();

      if (error) {
        console.error('Error fetching business settings:', error);
        return;
      }

      setShowInServices(data?.show_in_services || false);
    };

    fetchBusinessSettings();
  }, [businessId]);

  // Handle toggle change
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
        {appointmentPrice && (
          <div className="mb-2">
            <span className="font-medium">Appointment Price:</span> ₹{appointmentPrice}
          </div>
        )}
        {consultationPrice && (
          <div>
            <span className="font-medium">Consultation Price:</span> ₹{consultationPrice}
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
      </Card>
    </div>
  );
};