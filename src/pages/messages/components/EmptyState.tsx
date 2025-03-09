
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNewChat: () => void;
}

export const EmptyState = ({ onNewChat }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full md:col-span-8 lg:col-span-9 border rounded-r-lg bg-background/50 p-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
        <p className="text-muted-foreground mb-6">
          Select a conversation or start a new chat to begin messaging
        </p>
        <Button onClick={onNewChat} className="gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
};
