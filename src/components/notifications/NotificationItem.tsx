
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Notification } from "@/types/notification";

interface NotificationItemProps extends Notification {
  onDelete: (id: string) => void;
}

export const NotificationItem = ({ 
  id, 
  message, 
  created_at, 
  read, 
  onDelete
}: NotificationItemProps) => {
  return (
    <div 
      className={`p-4 flex items-start gap-3 border-b ${read ? 'bg-muted/50' : 'bg-background'}`}
    >
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </span>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(id)}
          title="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
