interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export const MessageBubble = ({ content, timestamp, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-accent/50 text-foreground'
        }`}
      >
        <p className="text-sm break-words">{content}</p>
        <span className={`text-xs mt-1 block ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};