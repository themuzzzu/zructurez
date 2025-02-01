import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatDialogs } from "./ChatDialogs";
import { useMessageHandling } from "./hooks/useMessageHandling";
import type { Chat } from "@/types/chat";

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

  const {
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  } = useMessageHandling(selectedChat, message, setMessage, () => {
    // Callback after message is sent successfully
    setMessage("");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
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

  return (
    <div className="flex flex-col h-full">
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
      />
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onAttachment={handleAttachment}
      />
      
      <ChatDialogs
        selectedChat={selectedChat}
        showNewChat={false}
        showNewGroup={false}
        showAddMembers={false}
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
        newMemberEmail=""
        onNewChat={async () => {}}
        onNewGroup={async () => {}}
        onAddMembers={async () => {}}
        onCloseNewChat={() => {}}
        onCloseNewGroup={() => {}}
        onCloseAddMembers={() => {}}
      />
    </div>
  );
};