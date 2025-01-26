import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const MessageSettings = () => {
  const [disappearingMessages, setDisappearingMessages] = useState(false);

  const handleDisappearingMessages = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to change message settings");
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({
          expires_at: enabled ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('sender_id', user.id);

      if (error) throw error;

      setDisappearingMessages(enabled);
      toast.success(enabled ? "Disappearing messages enabled" : "Disappearing messages disabled");
    } catch (error) {
      console.error('Error updating disappearing messages:', error);
      toast.error("Failed to update message settings");
    }
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="disappearing-messages" className="text-sm font-medium">
        Disappearing messages
      </Label>
      <Switch
        id="disappearing-messages"
        checked={disappearingMessages}
        onCheckedChange={handleDisappearingMessages}
      />
      {disappearingMessages && (
        <p className="text-sm text-muted-foreground">
          Messages will disappear after 24 hours
        </p>
      )}
    </div>
  );
};