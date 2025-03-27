
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Notification } from "@/types/notification";
import { Button } from "../ui/button";
import { Trash2, CheckSquare } from "lucide-react";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "../ui/alert-dialog";

export const NotificationList = () => {
  const queryClient = useQueryClient();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
  const [isDeleteSelectedAlertOpen, setIsDeleteSelectedAlertOpen] = useState(false);

  const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Deleting notification:", notificationId);
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success("Notification deleted");
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast.error("Failed to delete notification");
    },
  });

  // New batch delete function that processes notifications in chunks
  const deleteSelectedNotificationsMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      if (notificationIds.length === 0) return;
      
      console.log(`Deleting ${notificationIds.length} notifications in batches`);
      
      // Split ids into smaller chunks to avoid query size limits
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < notificationIds.length; i += batchSize) {
        batches.push(notificationIds.slice(i, i + batchSize));
      }

      console.log(`Processing ${batches.length} batches of max ${batchSize} items each`);
      
      // Process each batch sequentially
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} items`);
        
        const { error } = await supabase
          .from('notifications')
          .delete()
          .in('id', batch);

        if (error) {
          console.error(`Error in batch ${i+1}:`, error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success(`Notifications deleted successfully`);
      setSelectedNotifications([]);
      setSelectMode(false);
    },
    onError: (error) => {
      console.error("Delete selected mutation error:", error);
      toast.error("Failed to delete notifications");
    },
  });

  // Updated delete all mutation to use batching
  const deleteAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      console.log("Fetching all notification IDs for user:", session.session.user.id);
      
      // First, get all notification IDs
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', session.session.user.id);
      
      if (fetchError) {
        console.error("Error fetching notification IDs:", fetchError);
        throw fetchError;
      }
      
      if (!data || data.length === 0) {
        console.log("No notifications to delete");
        return;
      }
      
      const notificationIds = data.map(n => n.id);
      console.log(`Deleting ${notificationIds.length} notifications in batches`);
      
      // Split ids into smaller chunks to avoid query size limits
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < notificationIds.length; i += batchSize) {
        batches.push(notificationIds.slice(i, i + batchSize));
      }

      console.log(`Processing ${batches.length} batches of max ${batchSize} items each`);
      
      // Process each batch sequentially
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} items`);
        
        const { error } = await supabase
          .from('notifications')
          .delete()
          .in('id', batch);

        if (error) {
          console.error(`Error in batch ${i+1}:`, error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success("All notifications deleted");
      setSelectedNotifications([]);
      setSelectMode(false);
    },
    onError: (error) => {
      console.error("Delete all mutation error:", error);
      toast.error("Failed to delete notifications");
    },
  });

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    setIsDeleteAllAlertOpen(true);
  };

  const confirmDeleteAll = () => {
    setIsDeleteAllAlertOpen(false);
    deleteAllNotificationsMutation.mutate();
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    setIsDeleteSelectedAlertOpen(true);
  };

  const confirmDeleteSelected = () => {
    setIsDeleteSelectedAlertOpen(false);
    deleteSelectedNotificationsMutation.mutate(selectedNotifications);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedNotifications([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(notification => notification.id));
    }
  };

  const toggleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-4 py-2">
        <h3 className="text-sm font-medium">Your Notifications</h3>
        <div className="flex gap-2">
          {selectMode && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 px-2"
                onClick={toggleSelectAll}
                disabled={notifications.length === 0}
              >
                {selectedNotifications.length === notifications.length ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 px-2 text-destructive hover:text-destructive"
                onClick={handleDeleteSelected}
                disabled={selectedNotifications.length === 0 || deleteSelectedNotificationsMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete Selected ({selectedNotifications.length})
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 px-2"
            onClick={toggleSelectMode}
            disabled={notifications.length === 0}
          >
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            {selectMode ? "Cancel" : "Select"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 px-2"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0 || deleteAllNotificationsMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear All
          </Button>
        </div>
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
      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setIsDeleteAllAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all notifications? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-destructive text-destructive-foreground">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Selected Confirmation Dialog */}
      <AlertDialog open={isDeleteSelectedAlertOpen} onOpenChange={setIsDeleteSelectedAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedNotifications.length} selected notifications? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSelected} className="bg-destructive text-destructive-foreground">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
