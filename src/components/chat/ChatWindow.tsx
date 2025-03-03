
import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatDialogs } from "./ChatDialogs";
import { useMessageHandling } from "./hooks/useMessageHandling";
import type { Chat } from "@/types/chat";
import { toast } from "sonner";

interface ChatWindowProps {
  selectedChat: Chat;
  onClose: () => void;
}

export const ChatWindow = ({ selectedChat, onClose }: ChatWindowProps) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [message, setMessage] = useState("");
  const [forwardMessage, setForwardMessage] = useState<string | null>(null);

  const {
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  } = useMessageHandling(selectedChat, message, setMessage, () => {
    setMessage("");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !forwardMessage) return;
    
    if (forwardMessage) {
      // If there's a message to forward, use it instead
      const tempMessage = forwardMessage;
      setForwardMessage(null);
      setMessage(tempMessage);
    }
    
    await handleSendMessage();
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
      case "poll":
        setShowPollDialog(true);
        break;
      case "contact":
        setShowContactDialog(true);
        break;
    }
  };

  const handleForwardMessage = (content: string) => {
    setForwardMessage(content);
    toast.success("Message ready to forward. Select a recipient or send in current chat.");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm bg-background">
      <ChatHeader
        chat={selectedChat}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        setShowContactInfo={setShowContactInfo}
        setIsSelectMode={setIsSelectMode}
        isSelectMode={isSelectMode}
        onClose={onClose}
      />
      <ChatMessages
        messages={selectedChat.messages}
        currentUserId={selectedChat.userId}
        onForwardMessage={handleForwardMessage}
      />
      {forwardMessage && (
        <div className="px-4 py-2 bg-muted flex items-center justify-between">
          <div className="text-sm">Forwarding: {forwardMessage.substring(0, 30)}...</div>
          <button 
            className="text-xs text-destructive"
            onClick={() => setForwardMessage(null)}
          >
            Cancel
          </button>
        </div>
      )}
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onAttachment={handleAttachment}
      />
      
      <ChatDialogs
        selectedChat={selectedChat}
        showNewChat={false}
        showContactInfo={showContactInfo}
        setShowContactInfo={setShowContactInfo}
        showImageUpload={showImageUpload}
        setShowImageUpload={setShowImageUpload}
        showVideoUpload={showVideoUpload}
        setShowVideoUpload={setShowVideoUpload}
        showDocumentUpload={showDocumentUpload}
        setShowDocumentUpload={setShowDocumentUpload}
        showPollDialog={showPollDialog}
        setShowPollDialog={setShowPollDialog}
        showContactDialog={showContactDialog}
        setShowContactDialog={setShowContactDialog}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        onNewChat={async () => {}}
        onCloseNewChat={() => {}}
      />
    </div>
  );
};
