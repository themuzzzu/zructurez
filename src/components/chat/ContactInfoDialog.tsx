import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Chat } from "@/types/chat";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Share2, MessageSquare } from "lucide-react";

interface ContactInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: Chat;
}

export const ContactInfoDialog = ({ open, onOpenChange, chat }: ContactInfoDialogProps) => {
  const [disappearingMessages, setDisappearingMessages] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState(
    "Hi! I'm interested in learning more about your business."
  );

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', chat.userId)
        .single();

      if (!error && data) {
        setBusinessProfile(data);
      }
    };

    if (chat.userId) {
      fetchBusinessProfile();
    }
  }, [chat.userId]);

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

  const handleShare = () => {
    if (businessProfile) {
      const businessUrl = `${window.location.origin}/business/${businessProfile.id}`;
      
      if (navigator.share) {
        navigator.share({
          title: businessProfile.name,
          text: `Check out ${businessProfile.name} - ${businessProfile.description}`,
          url: businessUrl
        }).catch(() => {
          navigator.clipboard.writeText(businessUrl);
          toast.success("Business profile link copied to clipboard!");
        });
      } else {
        navigator.clipboard.writeText(businessUrl);
        toast.success("Business profile link copied to clipboard!");
      }
    }
  };

  const handleWhatsApp = () => {
    if (businessProfile?.contact) {
      const whatsappUrl = `https://wa.me/${businessProfile.contact.replace(/\D/g, '')}?text=${encodeURIComponent(greeting)}`;
      window.open(whatsappUrl, '_blank');
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
          
          {businessProfile && (
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Business Profile</p>
                <p className="text-muted-foreground">{businessProfile.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="greeting">Default Greeting</Label>
                <Textarea
                  id="greeting"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Enter your default greeting message"
                  className="h-24"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </Button>
              </div>
            </div>
          )}

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