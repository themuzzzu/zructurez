import { useState } from "react";
import { Chat } from "@/types/chat";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { useMessageForwarding } from "./hooks/useMessageForwarding";
import { useAttachments } from "./hooks/useAttachments";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatDialogs } from "./ChatDialogs";
import { useAuth } from "../../hooks/useAuth";

interface ChatWindowProps {
  selectedChat: Chat | null;
  onBack?: () => void;
  onMessageSent?: () => void;
  onClose: () => void;
}

export const ChatWindow = ({
  selectedChat,
  onBack,
  onMessageSent,
  onClose,
}: ChatWindowProps) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const {
    showImageUpload,
    setShowImageUpload,
    showVideoUpload,
    setShowVideoUpload,
    showDocumentUpload,
    setShowDocumentUpload,
    showPollDialog,
    setShowPollDialog,
    showContactDialog,
    setShowContactDialog,
    handleAttachment,
  } = useAttachments();

  const {
    selectedImage,
    setSelectedImage,
    selectedVideo,
    setSelectedVideo,
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  } = useMessageHandling(selectedChat, message, setMessage, onMessageSent);

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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chat={selectedChat}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        setShowContactInfo={setShowContactInfo}
        setIsSelectMode={setIsSelectMode}
        isSelectMode={isSelectMode}
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto">
        <ChatMessages 
          messages={selectedChat.messages || []}
          currentUserId={user?.id || ''}
          isGroup={selectedChat.type === 'group'}
          onForwardMessage={handleForwardMessage}
        />
      </div>

      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onAttachment={handleAttachment}
      />

      <ChatDialogs
        selectedChat={selectedChat}
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
      />
    </div>
  );
};