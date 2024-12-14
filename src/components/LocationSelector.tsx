import { Check } from "lucide-react";
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select location..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
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