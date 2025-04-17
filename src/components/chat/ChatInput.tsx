
import React from 'react';
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
    <div className="p-4 border-t bg-background">
      <div className="flex items-center gap-2">
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
