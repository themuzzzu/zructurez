import { AttachmentButtons } from "./AttachmentButtons";
import { MessageInput } from "./MessageInput";

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAttachment: (type: string) => void;
}

export const ChatInput = ({
  message,
  onMessageChange,
  onSubmit,
  onAttachment,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t bg-background fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center gap-2 mb-2 max-w-[calc(100vw-400px)] mx-auto">
        <AttachmentButtons onAttachment={onAttachment} />
        <MessageInput
          message={message}
          onMessageChange={onMessageChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};