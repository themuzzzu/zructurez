import { Chat } from "@/types/chat";
import { ChatMenu } from "./ChatMenu";
import { formatDistanceToNow } from "date-fns";
import { Phone, Video, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';

interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
  onClose?: () => void;
  onBack?: () => void;
  userPresence?: Record<string, string>;
}

export const ChatHeader = ({
  chat,
  isMuted,
  setIsMuted,
  setShowContactInfo,
  setIsSelectMode,
  isSelectMode,
  onClose,
  onBack,
  userPresence = {},
}: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  const getLastSeen = () => {
    // Check if user is currently online
    if (userPresence[chat.userId] === 'online') {
      return 'online';
    }
    
    // Check if we have a last seen timestamp for this user
    const lastSeenTime = userPresence[chat.userId];
    if (lastSeenTime && lastSeenTime !== 'online') {
      try {
        return `last seen ${formatDistanceToNow(new Date(lastSeenTime), { addSuffix: true })}`;
      } catch (error) {
        // Fall back to time from chat if presence data is invalid
        try {
          if (chat.time.includes('ago')) {
            return chat.time;
          }
          return formatDistanceToNow(new Date(chat.time), { addSuffix: true });
        } catch (error) {
          return 'recently';
        }
      }
    }
    
    // If no presence data, use chat time
    try {
      if (chat.time.includes('ago')) {
        return chat.time;
      }
      return formatDistanceToNow(new Date(chat.time), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  const handleProfileClick = () => {
    setShowContactInfo(true);
  };

  const handleVoiceCall = () => {
    toast.info("Voice call feature coming soon!");
  };

  const handleVideoCall = () => {
    toast.info("Video call feature coming soon!");
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div 
            className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <AvatarWithFallback
                  src={chat.avatar}
                  name={chat.name}
                  userId={chat.userId}
                  size="md"
                />
                {userPresence[chat.userId] === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <span className="font-semibold">{chat.name}</span>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {userPresence[chat.userId] === 'online' ? null : <Clock className="h-3 w-3" />}
                  <p>{getLastSeen()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent hover:text-accent-foreground"
            onClick={handleVoiceCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent hover:text-accent-foreground"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
          <ChatMenu
            selectedChat={chat}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            setShowContactInfo={setShowContactInfo}
            setIsSelectMode={setIsSelectMode}
            isSelectMode={isSelectMode}
          />
        </div>
      </div>
    </div>
  );
};
