
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ClosureReason = 'food_break' | 'sick' | 'holiday' | 'other' | 'next_day' | '';

interface TemporaryStatusProps {
  id: string;
  isOpen: boolean;
}

export const TemporaryStatus = ({ id, isOpen }: TemporaryStatusProps) => {
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState("");
  const [temporarilyUnavailable, setTemporarilyUnavailable] = useState(false);
  const [closureReason, setClosureReason] = useState<ClosureReason>('');

  const handleTemporaryStatus = async (checked: boolean) => {
    setTemporarilyUnavailable(checked);
    if (!checked) {
      try {
        const { error } = await supabase
          .from('businesses')
          .update({ 
            wait_time: null,
            closure_reason: null
          })
          .eq('id', id);

        if (error) throw error;
        setWaitTime("");
        setClosureReason('');
      } catch (error) {
        console.error('Error clearing wait time:', error);
        toast.error("Failed to update availability");
      }
    }
  };

  const updateWaitTime = async () => {
    if (!waitTime) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          wait_time: waitTime,
          closure_reason: closureReason || null
        })
        .eq('id', id);

      if (error) throw error;
      toast.success("Wait time updated successfully");
    } catch (error) {
      console.error('Error updating wait time:', error);
      toast.error("Failed to update wait time");
    } finally {
      setLoading(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'food_break': return 'Food Break';
      case 'sick': return 'Sick Leave';
      case 'holiday': return 'Holiday';
      case 'next_day': return 'Available Next Day';
      case 'other': return 'Other';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="temporary-status"
          checked={temporarilyUnavailable}
          onCheckedChange={handleTemporaryStatus}
          disabled={loading || !isOpen}
        />
        <Label htmlFor="temporary-status">
          Temporarily Unavailable
        </Label>
      </div>

      {temporarilyUnavailable && (
        <div className="space-y-4">
          <Select
            value={closureReason}
            onValueChange={(value: ClosureReason) => setClosureReason(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[200px] min-w-[200px]">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              <SelectItem value="food_break">Food Break</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="next_day">Available Next Day</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Available in... (e.g., 30 mins)"
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
              className="w-48 min-w-[12rem]"
              disabled={loading}
            />
            <Button 
              variant="secondary" 
              onClick={updateWaitTime}
              disabled={!waitTime || loading}
            >
              Set Wait Time
            </Button>
          </div>

          {waitTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Available in {waitTime}
                {closureReason && ` (${getReasonLabel(closureReason)})`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
