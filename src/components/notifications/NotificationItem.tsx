import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

interface NotificationItemProps {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ id, message, created_at, read, onMarkAsRead }: NotificationItemProps) => {
  return (
    <div className={`p-4 flex items-start gap-3 border-b ${read ? 'bg-muted/50' : 'bg-background'}`}>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </span>
      </div>
      {!read && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0"
          onClick={() => onMarkAsRead(id)}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};