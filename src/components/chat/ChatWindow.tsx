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
import { AttachmentButtons } from "./AttachmentButtons";
import { MessageInput } from "./MessageInput";
import { PollDialog } from "./PollDialog";
import { ContactDialog } from "./ContactDialog";
import { DocumentUpload } from "./DocumentUpload";
import { VideoUpload } from "./VideoUpload";

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
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
    } else if (selectedVideo) {
      handleSendVideo();
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

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message || "Sent an image",
          sender_id: "me",
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

  const handleSendVideo = async () => {
    if (!selectedVideo || !selectedChat) return;

    try {
      const file = await fetch(selectedVideo).then((r) => r.blob());
      const fileExt = "mp4";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-videos")
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message || "Sent a video",
          sender_id: "me",
          receiver_id: selectedChat.userId,
          video_url: publicUrl,
        });

      if (messageError) throw messageError;

      setSelectedVideo(null);
      setShowVideoUpload(false);
      onMessageChange("");
      toast.success("Video sent successfully!");
    } catch (error) {
      console.error("Error sending video:", error);
      toast.error("Failed to send video");
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
      case "video":
        setShowVideoUpload(true);
        break;
      case "document":
        setShowDocumentUpload(true);
        break;
      case "contact":
        setShowContactDialog(true);
        break;
      case "poll":
        setShowPollDialog(true);
        break;
      case "drawing":
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
        <div className="flex items-center gap-2 mb-2">
          <AttachmentButtons onAttachment={handleAttachment} />
          <MessageInput 
            message={message}
            onMessageChange={onMessageChange}
            onSubmit={handleSubmit}
          />
        </div>
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

      <Dialog open={showVideoUpload} onOpenChange={setShowVideoUpload}>
        <DialogContent>
          <VideoUpload
            selectedVideo={selectedVideo}
            onVideoSelect={setSelectedVideo}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
        <DialogContent>
          <DocumentUpload
            onDocumentUpload={async (file) => {
              try {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `chat-documents/${fileName}`;

                const { error: uploadError } = await supabase.storage
                  .from("chat-documents")
                  .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                  .from("chat-documents")
                  .getPublicUrl(filePath);

                const { error: docError } = await supabase
                  .from("documents")
                  .insert({
                    title: file.name,
                    file_url: publicUrl,
                    file_type: file.type,
                    user_id: "me",
                  });

                if (docError) throw docError;

                setShowDocumentUpload(false);
                toast.success("Document uploaded successfully!");
              } catch (error) {
                console.error("Error uploading document:", error);
                toast.error("Failed to upload document");
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <PollDialog
        open={showPollDialog}
        onOpenChange={setShowPollDialog}
        onCreatePoll={async (question, options) => {
          try {
            const { error } = await supabase
              .from("polls")
              .insert({
                question,
                options,
                user_id: "me",
              });

            if (error) throw error;

            setShowPollDialog(false);
            toast.success("Poll created successfully!");
          } catch (error) {
            console.error("Error creating poll:", error);
            toast.error("Failed to create poll");
          }
        }}
      />

      <ContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onShareContact={async (contactData) => {
          try {
            const { error } = await supabase
              .from("shared_contacts")
              .insert({
                contact_data: contactData,
                user_id: "me",
                shared_with_id: selectedChat.userId,
              });

            if (error) throw error;

            setShowContactDialog(false);
            toast.success("Contact shared successfully!");
          } catch (error) {
            console.error("Error sharing contact:", error);
            toast.error("Failed to share contact");
          }
        }}
      />
    </div>
  );
};