
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Notification } from "@/types/notification";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export const NotificationList = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
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

  const clearAllNotificationsMutation = useMutation({
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
    },
    onError: () => {
      toast.error("Failed to delete notifications");
    },
  });

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    clearAllNotificationsMutation.mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-4 py-2">
        <h3 className="text-sm font-medium">Your Notifications</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 px-2"
          onClick={handleClearAll}
          disabled={notifications.length === 0 || clearAllNotificationsMutation.isPending}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete All
        </Button>
      </div>
      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
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
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
