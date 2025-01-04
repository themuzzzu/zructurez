import { Message } from "@/types/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useMessageForwarding = () => {
  const handleForwardMessage = async (messageId: string) => {
    try {
      const { data: message } = await supabase
        .from("messages")
        .select("*")
        .eq("id", messageId)
        .maybeSingle();

      if (!message) {
        toast.error("Message not found");
        return;
      }

      // For now just show a toast - implement actual forwarding later
      toast.success("Message forwarding will be implemented soon!");
    } catch (error) {
      console.error("Error forwarding message:", error);
      toast.error("Failed to forward message");
    }
  };

  return { handleForwardMessage };
};