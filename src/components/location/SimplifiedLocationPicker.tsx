
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, X } from "lucide-react";
import { useLocation } from "@/providers/LocationProvider";
import popularLocations from "@/data/popularLocations";

interface SimplifiedLocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstVisit?: boolean;
}

export const SimplifiedLocationPicker = ({ open, onOpenChange, firstVisit = false }: SimplifiedLocationPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentLocation, updateLocation } = useLocation();
  
  const filteredLocations = popularLocations
    .filter(location => 
      location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 8); // Limit to 8 results for better UX
  
  const handleSelectLocation = (location: string) => {
    updateLocation(location);
    onOpenChange(false); // Close the dialog after selection
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Select your location</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="relative flex items-center mb-4">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search locations..."
            className="pl-9 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Button
                key={location}
                variant="ghost"
                className="justify-start font-normal"
                onClick={() => handleSelectLocation(location)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location}
              </Button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No locations found</div>
          )}
        </div>
        
        {firstVisit && (
          <DialogFooter>
            <Button 
              onClick={() => handleSelectLocation("All India")} 
              variant="outline"
              className="w-full"
            >
              Skip for now
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
