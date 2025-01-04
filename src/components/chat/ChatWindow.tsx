import { Send, Camera, Image, FileText, Users, MessageSquare, Poll, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/types/chat";
import { ChatMenu } from "./ChatMenu";
import { ContactInfoDialog } from "./ContactInfoDialog";
import { useState } from "react";
import { MessageBubble } from "../MessageBubble";
import { ImageUpload } from "../ImageUpload";
import { Dialog, DialogContent } from "../ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatWindowProps {
  selectedChat: Chat | null;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const ChatWindow = ({
  selectedChat,
  message,
  onMessageChange,
  onSendMessage,
}: ChatWindowProps) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      handleSendImage();
    } else {
      onSendMessage();
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage || !selectedChat) return;

    try {
      const file = await fetch(selectedImage).then((r) => r.blob());
      const fileExt = "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);

      // Send message with image
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message || "Sent an image",
          sender_id: "me", // Replace with actual user ID
          receiver_id: selectedChat.userId,
          image_url: publicUrl,
        });

      if (messageError) throw messageError;

      setSelectedImage(null);
      setShowImageUpload(false);
      onMessageChange("");
      toast.success("Image sent successfully!");
    } catch (error) {
      console.error("Error sending image:", error);
      toast.error("Failed to send image");
    }
  };

  const handleForwardMessage = (content: string) => {
    onMessageChange(content);
  };

  const handleAttachment = (type: string) => {
    switch (type) {
      case "photo":
        setShowImageUpload(true);
        break;
      case "camera":
        // Implement camera functionality
        toast.info("Camera feature coming soon!");
        break;
      case "document":
        // Implement document upload
        toast.info("Document upload feature coming soon!");
        break;
      case "contact":
        // Implement contact sharing
        toast.info("Contact sharing feature coming soon!");
        break;
      case "poll":
        // Implement poll creation
        toast.info("Poll feature coming soon!");
        break;
      case "drawing":
        // Implement drawing feature
        toast.info("Drawing feature coming soon!");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{selectedChat.name}</span>
          </div>
          <ChatMenu
            selectedChat={selectedChat}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            setShowContactInfo={setShowContactInfo}
            setIsSelectMode={setIsSelectMode}
            isSelectMode={isSelectMode}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedChat.messages?.map((msg) => (
            <MessageBubble
              key={msg.id}
              messageId={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              isOwn={msg.senderId === "me"}
              onForward={handleForwardMessage}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("photo")}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("camera")}
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("document")}
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("contact")}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("poll")}
          >
            <Poll className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAttachment("drawing")}
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <ContactInfoDialog
        open={showContactInfo}
        onOpenChange={setShowContactInfo}
        chat={selectedChat}
      />

      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent>
          <ImageUpload
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};