import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Chat } from "@/types/chat";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat;
}

export const ContactInfoDialog = ({ open, onOpenChange, chat }: ContactInfoDialogProps) => {
  const [disappearingMessages, setDisappearingMessages] = useState(false);

  const handleDisappearingMessages = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to change message settings");
        return;
      }

      // Update user preference for disappearing messages with this contact
      const { error } = await supabase
        .from('messages')
        .update({
          expires_at: enabled ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null // 24 hours from now
        })
        .eq('sender_id', user.id)
        .eq('receiver_id', chat.userId);

      if (error) throw error;

      setDisappearingMessages(enabled);
      toast.success(enabled ? "Disappearing messages enabled" : "Disappearing messages disabled");
    } catch (error) {
      console.error('Error updating disappearing messages:', error);
      toast.error("Failed to update message settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="disappearing-messages" className="text-sm font-medium">
                Disappearing messages
              </Label>
              <Switch
                id="disappearing-messages"
                checked={disappearingMessages}
                onCheckedChange={handleDisappearingMessages}
              />
            </div>
            {disappearingMessages && (
              <p className="text-sm text-muted-foreground">
                Messages will disappear after 24 hours
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};