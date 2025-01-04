import { Chat } from "@/types/chat";
import { ChatMenu } from "./ChatMenu";
import { formatDistanceToNow } from "date-fns";

interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
}

export const ChatHeader = ({
  chat,
  isMuted,
  setIsMuted,
  setShowContactInfo,
  setIsSelectMode,
  isSelectMode,
}: ChatHeaderProps) => {
  // Format the last seen time - using a mock time for now
  const lastSeen = formatDistanceToNow(new Date(chat.time), { addSuffix: true });

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="font-semibold">{chat.name}</span>
              <p className="text-xs text-muted-foreground">last seen {lastSeen}</p>
            </div>
          </div>
        </div>
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
  );
};