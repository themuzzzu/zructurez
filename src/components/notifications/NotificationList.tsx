
import { useNotifications } from "./hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export const NotificationList = () => {
  // Get notification data and operations
  const { 
    notifications, 
    isLoading, 
    isError, 
    deleteNotificationMutation,
    deleteAllNotificationsMutation
  } = useNotifications();

  // Handle delete notification
  const handleDelete = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  // Handle delete all notifications
  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    deleteAllNotificationsMutation.mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-4 py-2">
        <h3 className="text-sm font-medium">Your Notifications</h3>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 px-2"
            onClick={handleDeleteAll}
            disabled={deleteAllNotificationsMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
        ) : isError ? (
          <div className="p-4 text-center text-destructive">Error loading notifications</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
