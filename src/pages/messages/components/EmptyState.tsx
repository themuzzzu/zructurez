
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNewChat: () => void;
}

export const EmptyState = ({ onNewChat }: EmptyStateProps) => {
  return (
    <div className="col-span-12 md:col-span-8 h-full" 
         style={{ display: 'block' }}>
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground border rounded-lg bg-background p-8 shadow-sm">
        <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
        <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
        <p className="text-center max-w-md">
          Select a chat or group to start messaging, or create a new conversation to connect with others.
        </p>
        <Button 
          className="mt-6"
          onClick={onNewChat}
        >
          <Plus className="h-4 w-4 mr-2" />
          Start New Conversation
        </Button>
      </div>
    </div>
  );
};
