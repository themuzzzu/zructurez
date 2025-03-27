
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Notification } from "@/types/notification";

export const useBatchOperations = (notifications: Notification[]) => {
  const queryClient = useQueryClient();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
  const [isDeleteSelectedAlertOpen, setIsDeleteSelectedAlertOpen] = useState(false);

  // Delete selected notifications in batches
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

  // Delete all notifications for current user
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

  return {
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
  };
};
