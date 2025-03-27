
import { useNotifications } from "./hooks/useNotifications";
import { useBatchOperations } from "./hooks/useBatchOperations";
import { NotificationItem } from "./NotificationItem";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationConfirmDialog } from "./NotificationConfirmDialog";
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
    isDeleteAllAlertOpen,
    isDeleteSelectedAlertOpen,
    setIsDeleteAllAlertOpen,
    setIsDeleteSelectedAlertOpen,
    deleteSelectedNotificationsMutation,
    deleteAllNotificationsMutation,
    handleDeleteAll,
    confirmDeleteAll,
    handleDeleteSelected,
    confirmDeleteSelected,
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
                console.log("Marking as read:", id);
                markAsReadMutation.mutate(id);
              }}
              onDelete={(id) => {
                console.log("Deleting notification:", id);
                deleteNotificationMutation.mutate(id);
              }}
              selectMode={selectMode}
              isSelected={selectedNotifications.includes(notification.id)}
              onToggleSelect={() => toggleSelectNotification(notification.id)}
            />
          ))
        )}
      </ScrollArea>

      {/* Delete All Confirmation Dialog */}
      <NotificationConfirmDialog 
        isOpen={isDeleteAllAlertOpen}
        onOpenChange={setIsDeleteAllAlertOpen}
        onConfirm={confirmDeleteAll}
        title="Delete All Notifications"
        description="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText="Delete All"
      />

      {/* Delete Selected Confirmation Dialog */}
      <NotificationConfirmDialog
        isOpen={isDeleteSelectedAlertOpen}
        onOpenChange={setIsDeleteSelectedAlertOpen}
        onConfirm={confirmDeleteSelected}
        title="Delete Selected Notifications"
        description={`Are you sure you want to delete ${selectedNotifications.length} selected notifications? This action cannot be undone.`}
        confirmText="Delete Selected"
      />
    </div>
  );
};
