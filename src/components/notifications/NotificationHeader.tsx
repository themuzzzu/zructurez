
import { Button } from "../ui/button";
import { Trash2, CheckSquare } from "lucide-react";
import { Notification } from "@/types/notification";

interface NotificationHeaderProps {
  notifications: Notification[];
  selectMode: boolean;
  selectedNotifications: string[];
  deleteSelectedIsPending: boolean;
  deleteAllIsPending: boolean;
  onToggleSelectMode: () => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
}

export const NotificationHeader = ({
  notifications,
  selectMode,
  selectedNotifications,
  deleteSelectedIsPending,
  deleteAllIsPending,
  onToggleSelectMode,
  onToggleSelectAll,
  onDeleteSelected,
  onDeleteAll
}: NotificationHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2 px-4 py-2">
      <h3 className="text-sm font-medium">Your Notifications</h3>
      <div className="flex gap-2">
        {selectMode && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-2"
              onClick={onToggleSelectAll}
              disabled={notifications.length === 0}
            >
              {selectedNotifications.length === notifications.length ? "Deselect All" : "Select All"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-2 text-destructive hover:text-destructive"
              onClick={onDeleteSelected}
              disabled={selectedNotifications.length === 0 || deleteSelectedIsPending}
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
          onClick={onToggleSelectMode}
          disabled={notifications.length === 0}
        >
          <CheckSquare className="h-3.5 w-3.5 mr-1" />
          {selectMode ? "Cancel" : "Select"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 px-2"
          onClick={onDeleteAll}
          disabled={notifications.length === 0 || deleteAllIsPending}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear All
        </Button>
      </div>
    </div>
  );
};
