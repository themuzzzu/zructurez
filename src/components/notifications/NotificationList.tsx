import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Notification } from "@/types/notification";

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

  return (
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
          />
        ))
      )}
    </ScrollArea>
  );
};