
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LocationPickerModalProps {
  onLocationSelect: (location: string) => void;
  onClose: () => void;
}

export const LocationPickerModal = ({ onLocationSelect, onClose }: LocationPickerModalProps) => {
  const popularLocations = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur"
  ];

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-center">Select Your Location</DialogTitle>
      </DialogHeader>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search for a city" 
          className="pl-10"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-3">Popular Cities</h3>
        <div className="grid grid-cols-3 gap-2">
          {popularLocations.map((location) => (
            <Button
              key={location}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleLocationSelect(location)}
            >
              {location}
            </Button>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};
