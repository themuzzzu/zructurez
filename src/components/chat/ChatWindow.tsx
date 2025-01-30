import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatDialogs } from "./ChatDialogs";
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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={selectedChat} onClose={onClose} />
      <ChatMessages chat={selectedChat} />
      <ChatInput chat={selectedChat} />
      
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