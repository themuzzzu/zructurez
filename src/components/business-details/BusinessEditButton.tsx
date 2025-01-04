import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit } from "lucide-react";
import { CreateBusinessForm } from "../CreateBusinessForm";

interface BusinessEditButtonProps {
  business: any;
  onSuccess: () => void;
  onClose?: () => void;
}

export const BusinessEditButton = ({ business, onSuccess, onClose }: BusinessEditButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsDialogOpen(true)}
        className="gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit Business
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogTitle>Edit Business</DialogTitle>
          <ScrollArea className="h-full pr-4">
            <CreateBusinessForm
              initialData={business}
              onSuccess={() => {
                setIsDialogOpen(false);
                onSuccess();
              }}
              onCancel={handleClose}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};