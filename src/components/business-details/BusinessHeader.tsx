import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessHeaderProps {
  id: string;
  name: string;
  category: string;
  isOwner: boolean;
  isOpen?: boolean;
  onEdit?: () => void;
}

export const BusinessHeader = ({ id, name, category, isOwner, isOpen = true, onEdit }: BusinessHeaderProps) => {
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState("");
  const [open, setOpen] = useState(isOpen);
  const [temporarilyUnavailable, setTemporarilyUnavailable] = useState(false);

  const handleStatusChange = async (checked: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_open: checked,
          wait_time: checked ? null : waitTime // Clear wait time when opening
        } as any)
        .eq('id', id);

      if (error) throw error;
      setOpen(checked);
      if (checked) {
        setTemporarilyUnavailable(false);
        setWaitTime("");
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
      // Clear wait time when becoming available
      try {
        const { error } = await supabase
          .from('businesses')
          .update({ wait_time: null } as any)
          .eq('id', id);

        if (error) throw error;
        setWaitTime("");
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
        .update({ wait_time: waitTime } as any)
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/business">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="text-muted-foreground">{category}</div>
          </div>
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

          {(temporarilyUnavailable || !open) && (
            <>
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
                  <span className="text-sm">Available in {waitTime}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};