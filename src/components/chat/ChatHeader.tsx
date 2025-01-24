import { Chat } from "@/types/chat";
import { ChatMenu } from "./ChatMenu";
import { formatDistanceToNow } from "date-fns";
import { Phone, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
  onBack?: () => void;
}

export const ChatHeader = ({
  chat,
  isMuted,
  setIsMuted,
  setShowContactInfo,
  setIsSelectMode,
  isSelectMode,
  onBack,
}: ChatHeaderProps) => {
  const getLastSeen = () => {
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
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-semibold">{chat.name}</span>
                <p className="text-xs text-muted-foreground">last seen {getLastSeen()}</p>
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