import { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHours {
  [key: string]: DaySchedule;
}

interface BusinessHoursSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const BusinessHoursSelect = ({ value, onChange }: BusinessHoursSelectProps) => {
  // Parse initial value if it exists
  const initialHours: BusinessHours = value ? JSON.parse(value) : {
    monday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    tuesday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    wednesday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    thursday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    friday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
    sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  };

  const [hours, setHours] = useState<BusinessHours>(initialHours);

  const handleDayToggle = (day: string, checked: boolean) => {
    const updatedHours = {
      ...hours,
      [day]: { ...hours[day], isOpen: checked },
    };
    setHours(updatedHours);
    onChange(JSON.stringify(updatedHours));
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    const updatedHours = {
      ...hours,
      [day]: { ...hours[day], [field]: value },
    };
    setHours(updatedHours);
    onChange(JSON.stringify(updatedHours));
  };

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-4">
      <Label>Business Hours</Label>
      <div className="space-y-4">
        {days.map(({ id, label }) => (
          <div key={id} className="flex items-start space-x-4">
            <div className="flex items-center space-x-2 min-w-[140px]">
              <Checkbox
                id={id}
                checked={hours[id].isOpen}
                onCheckedChange={(checked) => handleDayToggle(id, checked as boolean)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
            {hours[id].isOpen && (
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={hours[id].openTime}
                  onChange={(e) => handleTimeChange(id, 'openTime', e.target.value)}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={hours[id].closeTime}
                  onChange={(e) => handleTimeChange(id, 'closeTime', e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};