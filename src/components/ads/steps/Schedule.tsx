
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { AdFormData } from "../types";

interface ScheduleProps {
  data: AdFormData;
  onChange: (data: Partial<AdFormData>) => void;
}

export const Schedule = ({ data, onChange }: ScheduleProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Schedule Your Advertisement</h3>
        <p className="text-sm text-muted-foreground">
          Choose when your advertisement should start and end
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => onChange({ startDate: date || new Date() })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP") : "No end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => onChange({ endDate: date })}
                initialFocus
                disabled={(date) => 
                  data.startDate ? date < data.startDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active-status"
            checked={data.isActive}
            onCheckedChange={(checked) => onChange({ isActive: checked })}
          />
          <Label htmlFor="active-status">
            Set advertisement as active
          </Label>
        </div>
      </div>
    </div>
  );
};
