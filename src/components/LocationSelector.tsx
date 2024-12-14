import { Check, MapPin, Locate } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const locations = {
  "San Francisco Bay Area": [
    "San Francisco",
    "Oakland",
    "San Jose",
    "Berkeley",
    "Palo Alto",
  ],
  "Los Angeles Area": [
    "Los Angeles",
    "Santa Monica",
    "Pasadena",
    "Long Beach",
    "Beverly Hills",
  ],
  "Sacramento Area": [
    "Sacramento",
    "Davis",
    "Roseville",
    "Folsom",
    "Elk Grove",
  ],
  "San Diego Area": [
    "San Diego",
    "La Jolla",
    "Coronado",
    "Carlsbad",
    "Oceanside",
  ],
};

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationAccess = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For demo purposes, we'll just set a default location
        // In a real app, you would use the coordinates to find the nearest city
        toast.success("Location accessed successfully!");
        onChange("San Francisco");
        setOpen(false);
        setIsLocating(false);
      },
      (error) => {
        toast.error("Unable to access location: " + error.message);
        setIsLocating(false);
      },
      { timeout: 5000 }
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {value || "Select location..."}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="p-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLocationAccess}
              disabled={isLocating}
            >
              <Locate className="h-4 w-4" />
              {isLocating ? "Accessing location..." : "Use my current location"}
            </Button>
          </div>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found.</CommandEmpty>
          {Object.entries(locations).map(([area, cities]) => (
            <CommandGroup key={area} heading={area}>
              {cities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
};