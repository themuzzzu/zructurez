
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { AdFormData } from "../types";

interface ScheduleProps {
  data: AdFormData;
  onChange: (data: Partial<AdFormData>) => void;
}

export const Schedule = ({ data, onChange }: ScheduleProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Set when your advertisement will run
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={data.startDate}
            onSelect={(date) => date && onChange({ startDate: date })}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Calendar
            mode="single"
            selected={data.endDate}
            onSelect={(date) => onChange({ endDate: date })}
            disabled={(date) => date < data.startDate}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={data.isActive}
          onCheckedChange={(checked) => onChange({ isActive: checked })}
        />
        <Label>Activate immediately after creation</Label>
      </div>
    </div>
  );
};
