
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationList } from "../notifications/NotificationList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Badge } from "../ui/badge";

export const NotificationButton = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const { data: unreadCount = 0, isLoading, refetch } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id)
        .eq('read', false);

      if (error) {
        console.error("Error fetching unread notifications:", error);
        throw error;
      }
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      // Refetch the unread count when the sheet is closed
      setTimeout(() => {
        refetch();
      }, 500);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative transition-transform duration-300 hover:scale-110">
            <Bell className="h-5 w-5" />
            {!isLoading && unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] font-bold animate-fade-in"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <NotificationList />
        </div>
      </SheetContent>
    </Sheet>
  );
};
