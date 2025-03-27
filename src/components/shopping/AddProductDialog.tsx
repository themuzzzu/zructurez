
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreateProductForm } from "@/components/marketplace/CreateProductForm";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddProductDialog = ({ isOpen, onOpenChange, onSuccess }: AddProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh]">
        <DialogTitle>Add New Product</DialogTitle>
        <ScrollArea className="h-full pr-4">
          <CreateProductForm onSuccess={onSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
