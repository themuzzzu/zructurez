
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerDemo } from "@/components/ui/time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, set } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { schedulePost } from "@/services/postService";
import { toast } from "sonner";

interface SchedulePostDialogProps {
  open: boolean;
  onClose: () => void;
  content: string;
  location?: string;
  image?: string | null;
  category?: string | null;
  groupId?: string | null;
  onSuccess?: () => void;
}

export const SchedulePostDialog = ({
  open,
  onClose,
  content,
  location,
  image,
  category,
  groupId,
  onSuccess
}: SchedulePostDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Parse the time string to hours and minutes
      const [hours, minutes] = time.split(":").map(Number);
      
      // Create a new date object with the selected date and time
      const scheduledFor = set(date, { 
        hours: hours, 
        minutes: minutes,
        seconds: 0,
        milliseconds: 0
      });
      
      // Make sure the scheduled time is in the future
      if (scheduledFor <= new Date()) {
        toast.error("Please select a future date and time");
        return;
      }
      
      await schedulePost({
        content,
        location,
        image,
        category,
        scheduledFor,
        groupId
      });
      
      toast.success("Post scheduled successfully");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error(error instanceof Error ? error.message : "Failed to schedule post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>
            Choose when you want your post to be published.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Time</label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSchedule} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
