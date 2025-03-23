
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNewChat: () => void;
}

export const EmptyState = ({ onNewChat }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full md:col-span-8 lg:col-span-9 border rounded-none sm:rounded-r-lg bg-background/50 p-4">
      <div className="max-w-md text-center px-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No chat selected</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Select a conversation or start a new chat to begin messaging
        </p>
        <Button onClick={onNewChat} variant="dark-nav" className="gap-2 mx-auto">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
};
