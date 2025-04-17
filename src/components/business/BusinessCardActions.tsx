
import React from 'react';
import { MessageSquare, Share2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

interface BusinessCardActionsProps {
  appointment_price?: number;
  onBookClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onWhatsAppClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onShareClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCallClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  is_open?: boolean;
}

export const BusinessCardActions = ({
  appointment_price,
  onBookClick,
  onWhatsAppClick,
  onShareClick,
  onCallClick,
  is_open
}: BusinessCardActionsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800">
      {appointment_price && (
        <Button 
          onClick={onBookClick} 
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
          variant="default" 
          disabled={!is_open}
        >
          Book Now
        </Button>
      )}
      <Button 
        onClick={onWhatsAppClick} 
        className={`w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 transition-colors ${!appointment_price ? 'col-span-2' : ''}`} 
        variant="default"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-primary-foreground">Message</span>
      </Button>
      <Button 
        onClick={onShareClick} 
        variant="outline" 
        className={`w-full flex items-center justify-center gap-2 text-foreground
          ${isDarkMode 
            ? "border-gray-700 hover:bg-gray-800" 
            : "border-gray-300 hover:bg-gray-100"}`}
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
      <Button 
        onClick={onCallClick} 
        variant="outline" 
        className={`w-full flex items-center justify-center gap-2 text-foreground
          ${isDarkMode 
            ? "border-gray-700 hover:bg-gray-800" 
            : "border-gray-300 hover:bg-gray-100"}`}
      >
        <Phone className="h-4 w-4" />
        <span>Call</span>
      </Button>
    </div>
  );
};
