
import { formatDistanceToNow } from "date-fns";
import { Check, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Notification } from "@/types/notification";
import { Checkbox } from "../ui/checkbox";

interface NotificationItemProps extends Notification {
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  selectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const NotificationItem = ({ 
  id, 
  message, 
  created_at, 
  read, 
  onMarkAsRead, 
  onDelete,
  selectMode = false,
  isSelected = false,
  onToggleSelect
}: NotificationItemProps) => {
  return (
    <div className={`p-4 flex items-start gap-3 border-b ${read ? 'bg-muted/50' : 'bg-background'} ${isSelected ? 'bg-accent/20' : ''}`}>
      {selectMode && (
        <div className="pt-1">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onToggleSelect}
            id={`select-notification-${id}`}
            aria-label="Select notification"
          />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </span>
      </div>
      <div className="flex space-x-1">
        {!read && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0"
            onClick={() => onMarkAsRead(id)}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(id)}
          title="Delete notification"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
