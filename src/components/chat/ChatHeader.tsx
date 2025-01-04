import { Chat } from "@/types/chat";
import { ChatMenu } from "./ChatMenu";

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
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{chat.name}</span>
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