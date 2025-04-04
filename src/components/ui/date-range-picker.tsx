
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  initialDateFrom?: Date;
  initialDateTo?: Date;
  onUpdate: (dateRange: { from: Date | undefined; to: Date | undefined }) => void;
  align?: "center" | "start" | "end";
  calendarClassName?: string;
}

export function DateRangePicker({
  className,
  initialDateFrom,
  initialDateTo,
  onUpdate,
  align = "start",
  calendarClassName,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateFrom && initialDateTo
      ? { from: initialDateFrom, to: initialDateTo }
      : undefined
  );

  // Handle date change
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onUpdate) {
      onUpdate(newDate || { from: undefined, to: undefined });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className={calendarClassName}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
