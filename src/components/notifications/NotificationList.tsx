
import { useNotifications } from "./hooks/useNotifications";
import { useBatchOperations } from "./hooks/useBatchOperations";
import { NotificationItem } from "./NotificationItem";
import { NotificationHeader } from "./NotificationHeader";
import { ScrollArea } from "../ui/scroll-area";

export const NotificationList = () => {
  // Get notification data and operations
  const { 
    notifications, 
    isLoading, 
    isError, 
    markAsReadMutation, 
    deleteNotificationMutation 
  } = useNotifications();

  // Get batch operations
  const {
    selectedNotifications,
    selectMode,
    deleteSelectedNotificationsMutation,
    deleteAllNotificationsMutation,
    handleDeleteAll,
    handleDeleteSelected,
    toggleSelectMode,
    toggleSelectAll,
    toggleSelectNotification
  } = useBatchOperations(notifications);

  return (
    <div>
      <NotificationHeader 
        notifications={notifications}
        selectMode={selectMode}
        selectedNotifications={selectedNotifications}
        deleteSelectedIsPending={deleteSelectedNotificationsMutation.isPending}
        deleteAllIsPending={deleteAllNotificationsMutation.isPending}
        onToggleSelectMode={toggleSelectMode}
        onToggleSelectAll={toggleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        onDeleteAll={handleDeleteAll}
      />

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
              onMarkAsRead={(id) => {
                markAsReadMutation.mutate(id);
              }}
              onDelete={(id) => {
                deleteNotificationMutation.mutate(id);
              }}
              selectMode={selectMode}
              isSelected={selectedNotifications.includes(notification.id)}
              onToggleSelect={() => toggleSelectNotification(notification.id)}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
