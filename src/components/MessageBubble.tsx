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
            : 'bg-accent text-accent-foreground'
        }`}
      >
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-70 mt-1 block">{timestamp}</span>
      </div>
    </div>
  );
};