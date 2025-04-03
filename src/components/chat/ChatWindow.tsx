
import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatDialogs } from "./ChatDialogs";
import { useMessageHandling } from "./hooks/useMessageHandling";
import type { Chat } from "@/types/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  selectedChat: Chat;
  onClose: () => void;
  onTyping?: (isTyping: boolean) => void;
  typingUsers?: Record<string, boolean>;
  userPresence?: Record<string, string>;
}

export const ChatWindow = ({ 
  selectedChat, 
  onClose, 
  onTyping,
  typingUsers = {},
  userPresence = {}
}: ChatWindowProps) => {
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
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  } = useMessageHandling(selectedChat, message, setMessage, () => {
    setMessage("");
  });

  // Simulate loading for better UX
  useEffect(() => {
    // Faster loading for chat window
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  // Subscribe to real-time updates for this chat
  useEffect(() => {
    // Create a channel to listen for new messages
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload.new);
          // The Messages component will handle the state update
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to new messages');
        }
        if (status === 'CHANNEL_ERROR') {
          toast.error('Error connecting to chat');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle typing indicator
  useEffect(() => {
    // Clean up typing indicator when component unmounts
    return () => {
      if (onTyping) {
        onTyping(false);
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [onTyping, typingTimeout]);

  const handleTyping = () => {
    if (!isTyping && onTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout to stop the typing indicator after 2 seconds
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (onTyping) {
        onTyping(false);
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    handleTyping();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !forwardMessage) return;
    
    if (forwardMessage) {
      // If there's a message to forward, use it instead
      const tempMessage = forwardMessage;
      setForwardMessage(null);
      setMessage(tempMessage);
    }
    
    // Clear typing indicator
    setIsTyping(false);
    if (onTyping) {
      onTyping(false);
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full md:col-span-8 lg:col-span-9 border rounded-none md:rounded-r-lg overflow-hidden shadow-sm bg-background">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <p className="text-sm text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full md:col-span-8 lg:col-span-9 border rounded-none md:rounded-r-lg overflow-hidden shadow-sm bg-background">
      <ChatHeader
        chat={selectedChat}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        setShowContactInfo={setShowContactInfo}
        setIsSelectMode={setIsSelectMode}
        isSelectMode={isSelectMode}
        onClose={onClose}
        userPresence={userPresence}
      />
      <ChatMessages
        messages={selectedChat.messages}
        currentUserId={selectedChat.userId}
        onForwardMessage={handleForwardMessage}
        typingUsers={typingUsers}
        otherUserId={selectedChat.userId}
      />
      {forwardMessage && (
        <div className="px-3 py-2 bg-muted flex items-center justify-between text-xs sm:text-sm">
          <div className="truncate">Forwarding: {forwardMessage.substring(0, 25)}...</div>
          <button 
            className="text-xs text-destructive ml-2"
            onClick={() => setForwardMessage(null)}
          >
            Cancel
          </button>
        </div>
      )}
      <ChatInput
        message={message}
        onMessageChange={handleMessageChange}
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
