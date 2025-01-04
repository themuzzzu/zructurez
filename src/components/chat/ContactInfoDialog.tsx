import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chat } from "@/types/chat";

interface ContactInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat;
}

export const ContactInfoDialog = ({ open, onOpenChange, chat }: ContactInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{chat.name}</h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};