import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInput = ({ message, onMessageChange, onSubmit }: MessageInputProps) => {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onMessageChange(message + emojiData.emoji);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            type="button"
            className="text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          side="top" 
          align="start"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height="350px"
          />
        </PopoverContent>
      </Popover>
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};