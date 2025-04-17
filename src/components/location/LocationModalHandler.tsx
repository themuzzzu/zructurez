
import { useEffect } from "react";
import { SimplifiedLocationPicker } from "./SimplifiedLocationPicker";
import { useLocation } from "@/providers/LocationProvider";
import { useLanguage } from "@/contexts/LanguageContext";

export function LocationModalHandler() {
  const { showLocationPicker, setShowLocationPicker, isFirstVisit, resetFirstVisit } = useLocation();
  const { t } = useLanguage();
  
  // Handle closing the modal for first-time users
  const handleOpenChange = (open: boolean) => {
    // Always allow closing through the onOpenChange handler
    setShowLocationPicker(open);
    
    // If we're closing and it's the first visit, mark as no longer first visit
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
