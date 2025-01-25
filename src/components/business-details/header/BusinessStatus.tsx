import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessStatusProps {
  id: string;
  initialIsOpen: boolean;
}

export const BusinessStatus = ({ id, initialIsOpen }: BusinessStatusProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(initialIsOpen);

  const handleStatusChange = async (checked: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_open: checked,
          wait_time: checked ? null : null,
          closure_reason: checked ? null : null
        })
        .eq('id', id);

      if (error) throw error;
      setOpen(checked);
      toast.success(`Business is now ${checked ? 'open' : 'closed'}`);
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error("Failed to update business status");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};