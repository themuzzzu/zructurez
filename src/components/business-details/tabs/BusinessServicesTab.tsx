import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CreateServiceForm } from "@/components/CreateServiceForm";

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