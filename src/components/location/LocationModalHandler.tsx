
import { useEffect } from "react";
import { SimplifiedLocationPicker } from "./SimplifiedLocationPicker";
import { useLocation } from "@/providers/LocationProvider";

export function LocationModalHandler() {
  const { showLocationPicker, setShowLocationPicker, isFirstVisit, resetFirstVisit } = useLocation();
  
  // Handle closing the modal for first-time users
  const handleOpenChange = (open: boolean) => {
    if (isFirstVisit && !open) {
      // Don't allow closing on first visit
      return;
    }
    setShowLocationPicker(open);
    if (!open && isFirstVisit) {
      resetFirstVisit();
    }
  };
  
  return (
    <SimplifiedLocationPicker
      open={showLocationPicker}
      onOpenChange={handleOpenChange}
      firstVisit={isFirstVisit}
    />
  );
}
