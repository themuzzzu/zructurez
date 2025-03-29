
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { toast } from "sonner";

export const useBatchOperations = (notifications: Notification[]) => {
  const queryClient = useQueryClient();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
  const [isDeleteSelectedAlertOpen, setIsDeleteSelectedAlertOpen] = useState(false);
  
  // Toggle select mode
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    if (selectMode) {
      setSelectedNotifications([]);
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((notification) => notification.id));
    }
  };

  // Toggle select notification
  const toggleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // Delete selected notifications mutation
  const deleteSelectedNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (selectedNotifications.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', selectedNotifications);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      setSelectedNotifications([]);
      setSelectMode(false);
      toast.success(`${selectedNotifications.length} notifications deleted`);
    },
    onError: (error) => {
      console.error("Error deleting selected notifications:", error);
      toast.error("Failed to delete notifications");
    },
  });

  // Delete all notifications mutation
  const deleteAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      setSelectedNotifications([]);
      setSelectMode(false);
      toast.success("All notifications cleared");
    },
    onError: (error) => {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to clear notifications");
    },
  });

  // Handle delete all notification
  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    deleteAllNotificationsMutation.mutate();
  };

  // Handle delete selected notifications
  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    deleteSelectedNotificationsMutation.mutate();
  };

  return {
    selectMode,
    selectedNotifications,
    isDeleteAllAlertOpen,
    isDeleteSelectedAlertOpen,
    setIsDeleteAllAlertOpen,
    setIsDeleteSelectedAlertOpen,
    deleteSelectedNotificationsMutation,
    deleteAllNotificationsMutation,
    toggleSelectMode,
    toggleSelectAll,
    toggleSelectNotification,
    handleDeleteAll,
    handleDeleteSelected,
  };
};
