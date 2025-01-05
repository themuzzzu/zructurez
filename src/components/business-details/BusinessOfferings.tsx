import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { BusinessProductForm } from "../settings/BusinessProductForm";
import { Card } from "../ui/card";

interface BusinessOfferingsProps {
  businessId: string;
  onSuccess?: () => void;
}

export const BusinessOfferings = ({ businessId, onSuccess }: BusinessOfferingsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <BusinessProductForm 
              businessId={businessId} 
              onSuccess={() => {
                setIsDialogOpen(false);
                onSuccess?.();
              }} 
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};