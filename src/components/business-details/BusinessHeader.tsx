import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface BusinessHeaderProps {
  id: string;
  name: string;
  category: string;
  isOwner: boolean;
  isOpen?: boolean;
  onEdit?: () => void;
}

type ClosureReason = 'food_break' | 'sick' | 'holiday' | 'other' | 'next_day' | '';

export const BusinessHeader = ({ id, name, category, isOwner, isOpen = true, onEdit }: BusinessHeaderProps) => {
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState("");
  const [open, setOpen] = useState(isOpen);
  const [temporarilyUnavailable, setTemporarilyUnavailable] = useState(false);
  const [closureReason, setClosureReason] = useState<ClosureReason>('');

  const handleStatusChange = async (checked: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_open: checked,
          wait_time: checked ? null : waitTime,
          closure_reason: checked ? null : closureReason
        } as any)
        .eq('id', id);

      if (error) throw error;
      setOpen(checked);
      if (checked) {
        setTemporarilyUnavailable(false);
        setWaitTime("");
        setClosureReason('');
      }
      toast.success(`Business is now ${checked ? 'open' : 'closed'}`);
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error("Failed to update business status");
    } finally {
      setLoading(false);
    }
  };

  const handleTemporaryStatus = async (checked: boolean) => {
    setTemporarilyUnavailable(checked);
    if (!checked) {
      try {
        const { error } = await supabase
          .from('businesses')
          .update({ 
            wait_time: null,
            closure_reason: null
          } as any)
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
        } as any)
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
      case 'food_break':
        return 'Food Break';
      case 'sick':
        return 'Sick Leave';
      case 'holiday':
        return 'Holiday';
      case 'next_day':
        return 'Available Next Day';
      case 'other':
        return 'Other';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/business">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{name}</h1>
            <Badge variant={open ? "success" : "destructive"}>
              {open ? "Open" : "Closed"}
            </Badge>
          </div>
          <div className="text-muted-foreground">{category}</div>
        </div>
        {isOwner && onEdit && (
          <Button onClick={onEdit}>Edit Business</Button>
        )}
      </div>

      {isOwner && (
        <div className="flex flex-wrap items-center gap-6 p-4 border rounded-lg bg-background">
          <div className="flex items-center gap-2">
            <Switch
              id="business-status"
              checked={open}
              onCheckedChange={handleStatusChange}
              disabled={loading}
            />
            <Label htmlFor="business-status">
              Business is {open ? 'Open' : 'Closed'}
            </Label>
          </div>

          {open && (
            <div className="flex items-center gap-2">
              <Switch
                id="temporary-status"
                checked={temporarilyUnavailable}
                onCheckedChange={handleTemporaryStatus}
                disabled={loading || !open}
              />
              <Label htmlFor="temporary-status">
                Temporarily Unavailable
              </Label>
            </div>
          )}

          {(!open || temporarilyUnavailable) && (
            <>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <Select
                    value={closureReason}
                    onValueChange={(value: ClosureReason) => setClosureReason(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food_break">Food Break</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="next_day">Available Next Day</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Available in... (e.g., 30 mins)"
                    value={waitTime}
                    onChange={(e) => setWaitTime(e.target.value)}
                    className="w-48"
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
            </>
          )}
        </div>
      )}
    </div>
  );
};