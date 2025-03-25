
import { useState, useMemo } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  className?: string;
}

export const LocationSelector = ({ 
  value, 
  onChange,
  className = ""
}: LocationSelectorProps) => {
  const [selectedMetro, setSelectedMetro] = useState<string>(
    value.includes(" - ") ? value.split(" - ")[0] : "All India"
  );

  const metros = useMemo(() => [
    "All India",
    "Delhi NCR",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur"
  ], []);

  const regions = useMemo(() => {
    const regionMap: Record<string, string[]> = {
      "Delhi NCR": ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
      "Mumbai": ["Mumbai", "Navi Mumbai", "Thane", "Kalyan"],
      "Bengaluru": ["Central", "East", "North", "South", "West"],
      "Hyderabad": ["Secunderabad", "Cyberabad", "Hitech City", "Old City"],
      "Chennai": ["Central", "North", "South", "West", "Anna Nagar"],
      "Kolkata": ["North", "South", "Central", "Salt Lake", "Howrah"],
      "Pune": ["Central", "East", "West", "Pimpri-Chinchwad"],
      "Ahmedabad": ["East", "West", "North", "South", "Gandhinagar"],
      "Jaipur": ["Walled City", "Civil Lines", "Mansarovar", "Vaishali Nagar"]
    };
    
    return regionMap;
  }, []);

  const handleMetroChange = (metro: string) => {
    setSelectedMetro(metro);
    if (metro === "All India") {
      onChange("All India");
    } else {
      onChange(`${metro} - All Areas`);
    }
  };

  const handleRegionChange = (region: string) => {
    onChange(`${selectedMetro} - ${region}`);
  };

  return (
    <div className={className}>
      <Select
        value={selectedMetro}
        onValueChange={handleMetroChange}
      >
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {metros.map((metro) => (
            <SelectItem key={metro} value={metro}>
              {metro}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMetro !== "All India" && (
        <Select
          value={value.includes(" - ") ? value.split(" - ")[1] : "All Areas"}
          onValueChange={handleRegionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Areas">All Areas</SelectItem>
            {regions[selectedMetro]?.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
