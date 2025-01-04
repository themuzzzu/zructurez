import { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  openPeriod: "AM" | "PM";
  closePeriod: "AM" | "PM";
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
    monday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    tuesday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    wednesday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    thursday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    friday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    saturday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
    sunday: { isOpen: false, openTime: "09:00", closeTime: "05:00", openPeriod: "AM", closePeriod: "PM" },
  };

  const [hours, setHours] = useState<BusinessHours>(initialHours);
  const [useUniformHours, setUseUniformHours] = useState(true);
  const [uniformOpenTime, setUniformOpenTime] = useState("09:00");
  const [uniformCloseTime, setUniformCloseTime] = useState("05:00");
  const [uniformOpenPeriod, setUniformOpenPeriod] = useState<"AM" | "PM">("AM");
  const [uniformClosePeriod, setUniformClosePeriod] = useState<"AM" | "PM">("PM");

  const handleDayToggle = (day: string, checked: boolean) => {
    const updatedHours = {
      ...hours,
      [day]: { 
        ...hours[day], 
        isOpen: checked,
        openTime: useUniformHours ? uniformOpenTime : hours[day].openTime,
        closeTime: useUniformHours ? uniformCloseTime : hours[day].closeTime,
        openPeriod: useUniformHours ? uniformOpenPeriod : hours[day].openPeriod,
        closePeriod: useUniformHours ? uniformClosePeriod : hours[day].closePeriod,
      },
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

  const handlePeriodChange = (day: string, field: 'openPeriod' | 'closePeriod', value: "AM" | "PM") => {
    const updatedHours = {
      ...hours,
      [day]: { ...hours[day], [field]: value },
    };
    setHours(updatedHours);
    onChange(JSON.stringify(updatedHours));
  };

  const handleUniformTimeChange = (field: 'openTime' | 'closeTime', value: string) => {
    if (field === 'openTime') {
      setUniformOpenTime(value);
    } else {
      setUniformCloseTime(value);
    }

    if (useUniformHours) {
      const updatedHours = { ...hours };
      Object.keys(updatedHours).forEach(day => {
        if (updatedHours[day].isOpen) {
          updatedHours[day][field] = value;
        }
      });
      setHours(updatedHours);
      onChange(JSON.stringify(updatedHours));
    }
  };

  const handleUniformPeriodChange = (field: 'openPeriod' | 'closePeriod', value: "AM" | "PM") => {
    if (field === 'openPeriod') {
      setUniformOpenPeriod(value);
    } else {
      setUniformClosePeriod(value);
    }

    if (useUniformHours) {
      const updatedHours = { ...hours };
      Object.keys(updatedHours).forEach(day => {
        if (updatedHours[day].isOpen) {
          updatedHours[day][field] = value;
        }
      });
      setHours(updatedHours);
      onChange(JSON.stringify(updatedHours));
    }
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
    <div className="space-y-6">
      <div>
        <Label>Business Hours</Label>
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uniform-hours"
              checked={useUniformHours}
              onCheckedChange={(checked) => setUseUniformHours(checked as boolean)}
            />
            <Label htmlFor="uniform-hours">Use same hours for all days</Label>
          </div>

          {useUniformHours && (
            <div className="flex items-center space-x-2 ml-6">
              <Input
                type="time"
                value={uniformOpenTime}
                onChange={(e) => handleUniformTimeChange('openTime', e.target.value)}
                className="w-32"
              />
              <Select
                value={uniformOpenPeriod}
                onValueChange={(value) => handleUniformPeriodChange('openPeriod', value as "AM" | "PM")}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
              <span>to</span>
              <Input
                type="time"
                value={uniformCloseTime}
                onChange={(e) => handleUniformTimeChange('closeTime', e.target.value)}
                className="w-32"
              />
              <Select
                value={uniformClosePeriod}
                onValueChange={(value) => handleUniformPeriodChange('closePeriod', value as "AM" | "PM")}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

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
            {hours[id].isOpen && !useUniformHours && (
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={hours[id].openTime}
                  onChange={(e) => handleTimeChange(id, 'openTime', e.target.value)}
                  className="w-32"
                />
                <Select
                  value={hours[id].openPeriod}
                  onValueChange={(value) => handlePeriodChange(id, 'openPeriod', value as "AM" | "PM")}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
                <span>to</span>
                <Input
                  type="time"
                  value={hours[id].closeTime}
                  onChange={(e) => handleTimeChange(id, 'closeTime', e.target.value)}
                  className="w-32"
                />
                <Select
                  value={hours[id].closePeriod}
                  onValueChange={(value) => handlePeriodChange(id, 'closePeriod', value as "AM" | "PM")}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};