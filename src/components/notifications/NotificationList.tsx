
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Notification } from "@/types/notification";
import { Button } from "../ui/button";
import { Trash2, CheckSquare } from "lucide-react";
import { useState } from "react";

export const NotificationList = () => {
  const queryClient = useQueryClient();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

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
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success("Notification deleted");
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  const deleteSelectedNotificationsMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      if (notificationIds.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', notificationIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success(`${selectedNotifications.length} notifications deleted`);
      setSelectedNotifications([]);
      setSelectMode(false);
    },
    onError: () => {
      toast.error("Failed to delete selected notifications");
    },
  });

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
      toast.success("All notifications deleted");
      setSelectedNotifications([]);
      setSelectMode(false);
    },
    onError: () => {
      toast.error("Failed to delete notifications");
    },
  });

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      deleteAllNotificationsMutation.mutate();
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} selected notifications?`)) {
      deleteSelectedNotificationsMutation.mutate(selectedNotifications);
    }
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
            Delete All
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
              onMarkAsRead={markAsReadMutation.mutate}
              onDelete={deleteNotificationMutation.mutate}
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
