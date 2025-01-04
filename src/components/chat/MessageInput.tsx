import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInput = ({ message, onMessageChange, onSubmit }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};