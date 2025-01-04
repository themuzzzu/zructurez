import { useState } from "react";
import { Chat } from "@/types/chat";
import { ContactInfoDialog } from "./ContactInfoDialog";
import { ImageUpload } from "../ImageUpload";
import { Dialog, DialogContent } from "../ui/dialog";
import { PollDialog } from "./PollDialog";
import { ContactDialog } from "./ContactDialog";
import { DocumentUpload } from "./DocumentUpload";
import { VideoUpload } from "./VideoUpload";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { useMessageForwarding } from "./hooks/useMessageForwarding";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
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
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const {
    selectedImage,
    setSelectedImage,
    selectedVideo,
    setSelectedVideo,
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  } = useMessageHandling(selectedChat, message, onMessageChange, onSendMessage);

  const { handleForwardMessage } = useMessageForwarding();

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      await handleSendImage();
    } else if (selectedVideo) {
      await handleSendVideo();
    } else {
      await handleSendMessage();
    }
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
      <ChatHeader
        chat={selectedChat}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        setShowContactInfo={setShowContactInfo}
        setIsSelectMode={setIsSelectMode}
        isSelectMode={isSelectMode}
      />

      <ChatMessages 
        chat={selectedChat} 
        onForwardMessage={handleForwardMessage}
      />

      <ChatInput
        message={message}
        onMessageChange={onMessageChange}
        onSubmit={handleSubmit}
        onAttachment={handleAttachment}
      />

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