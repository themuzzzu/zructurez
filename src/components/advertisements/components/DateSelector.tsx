
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

interface DateSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const DateSelector = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: DateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Start Date</Label>
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={onStartDateChange}
          disabled={(date) => date < new Date()}
        />
      </div>
      <div>
        <Label>End Date</Label>
        <Calendar
          mode="single"
          selected={endDate}
          onSelect={onEndDateChange}
          disabled={(date) => !startDate || date < startDate}
        />
      </div>
    </div>
  );
};
