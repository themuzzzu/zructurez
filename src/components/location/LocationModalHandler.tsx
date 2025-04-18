
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
  
  // Add styles for the location modal to ensure proper positioning on all devices
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'location-modal-styles';
    styleEl.innerHTML = `
      @media (max-width: 640px) {
        [data-radix-popper-content-wrapper] {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          transform: none !important;
          max-width: 100% !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100vh !important;
          z-index: 9999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        
        .radix-dialog-content,
        [data-radix-dialog-content] {
          width: 100% !important;
          max-height: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          height: 100% !important;
          max-width: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }
      }
    `;
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('location-modal-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(styleEl);
    
    // Clean up on component unmount
    return () => {
      const styleEl = document.getElementById('location-modal-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);
  
  return (
    <SimplifiedLocationPicker
      open={showLocationPicker}
      onOpenChange={handleOpenChange}
      firstVisit={isFirstVisit}
    />
  );
}
