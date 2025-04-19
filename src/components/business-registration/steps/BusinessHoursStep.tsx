
import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Changed to use sonner directly

type DayHoursEntry = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

type DayHours = {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const BusinessHoursStep = () => {
  const { register, watch, setValue } = useFormContext();
  const is24_7 = watch("is_24_7");
  const [dayHours, setDayHours] = useState<DayHours>(() => {
    const hoursText = watch("hours") || "";
    const initialHours: DayHours = {};
    
    DAYS.forEach(day => {
      initialHours[day] = {
        open: "09:00",
        close: "17:00",
        closed: day === "Sunday"
      };
    });
    
    // Try to parse existing hours if available
    if (hoursText && typeof hoursText === "string") {
      try {
        const entries = hoursText.split(",").map(entry => entry.trim());
        
        entries.forEach(entry => {
          const dayMatch = entry.match(/^(.*?):/);
          if (!dayMatch) return;
          
          const day = dayMatch[1].trim();
          
          if (day === "Mon-Fri") {
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(weekday => {
              const timeMatch = entry.match(/:\s*(.*?)\s*-\s*(.*?)\s*$/);
              if (timeMatch) {
                initialHours[weekday] = {
                  open: convertTo24HourFormat(timeMatch[1]),
                  close: convertTo24HourFormat(timeMatch[2]),
                  closed: entry.toLowerCase().includes("closed")
                };
              }
            });
          } else if (day === "Sat") {
            const timeMatch = entry.match(/:\s*(.*?)\s*-\s*(.*?)\s*$/);
            if (timeMatch) {
              initialHours["Saturday"] = {
                open: convertTo24HourFormat(timeMatch[1]),
                close: convertTo24HourFormat(timeMatch[2]),
                closed: entry.toLowerCase().includes("closed")
              };
            }
          } else if (day === "Sun") {
            initialHours["Sunday"] = {
              open: "09:00",
              close: "17:00",
              closed: entry.toLowerCase().includes("closed")
            };
          } else {
            // Individual day format
            const mappedDay = mapShortDayToFull(day);
            if (mappedDay && initialHours[mappedDay]) {
              const timeMatch = entry.match(/:\s*(.*?)\s*-\s*(.*?)\s*$/);
              if (timeMatch) {
                initialHours[mappedDay] = {
                  open: convertTo24HourFormat(timeMatch[1]),
                  close: convertTo24HourFormat(timeMatch[2]),
                  closed: entry.toLowerCase().includes("closed")
                };
              }
            }
          }
        });
      } catch (error) {
        console.error("Error parsing hours:", error);
      }
    }
    
    return initialHours;
  });
  
  const [specialHours, setSpecialHours] = useState<DayHoursEntry[]>([]);
  
  const formattedHours = useMemo(() => {
    if (is24_7) {
      return "24/7";
    }
    
    const segments: string[] = [];
    let currentGroup: string[] = [];
    let prevHours = '';
    
    // Group consecutive days with the same hours
    DAYS.forEach((day, index) => {
      const { open, close, closed } = dayHours[day] || { open: '', close: '', closed: true };
      const hoursString = closed ? "Closed" : `${formatTime(open)} - ${formatTime(close)}`;
      
      if (index === 0 || hoursString !== prevHours) {
        // Start a new group
        if (currentGroup.length > 0) {
          // Add the previous group to segments
          segments.push(formatDayGroup(currentGroup, prevHours));
          currentGroup = [];
        }
        currentGroup.push(day);
      } else {
        // Continue the current group
        currentGroup.push(day);
      }
      
      prevHours = hoursString;
      
      // Handle the last group
      if (index === DAYS.length - 1 && currentGroup.length > 0) {
        segments.push(formatDayGroup(currentGroup, hoursString));
      }
    });
    
    // Add special hours
    specialHours.forEach(special => {
      if (!special.day || (!special.open || !special.close) && !special.closed) return;
      
      const hoursString = special.closed ? "Closed" : `${formatTime(special.open)} - ${formatTime(special.close)}`;
      segments.push(`${special.day}: ${hoursString}`);
    });
    
    return segments.join(", ");
  }, [dayHours, is24_7, specialHours]);
  
  // Update the form value whenever formatted hours change
  useMemo(() => {
    setValue("hours", formattedHours);
  }, [formattedHours, setValue]);
  
  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setDayHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  
  const addSpecialHours = () => {
    setSpecialHours(prev => [
      ...prev,
      { day: "Holiday", open: "09:00", close: "17:00", closed: false }
    ]);
  };
  
  const removeSpecialHours = (index: number) => {
    setSpecialHours(prev => prev.filter((_, i) => i !== index));
  };
  
  const copyFromPreviousDay = (dayIndex: number) => {
    if (dayIndex === 0) return;
    
    const prevDay = DAYS[dayIndex - 1];
    const currentDay = DAYS[dayIndex];
    
    setDayHours(prev => ({
      ...prev,
      [currentDay]: { ...prev[prevDay] }
    }));
    
    toast.success("Hours copied from previous day");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Hours</h3>
        <p className="text-sm text-muted-foreground">
          Set your regular operating hours. This helps customers know when they can visit or contact your business.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_24_7"
          checked={is24_7}
          onCheckedChange={value => setValue("is_24_7", value)}
        />
        <Label htmlFor="is_24_7" className="font-medium">This business is open 24/7</Label>
      </div>
      
      {!is24_7 && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {DAYS.map((day, index) => (
                  <div key={day} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 sm:col-span-2">
                      <Label>{day}</Label>
                    </div>
                    
                    <div className="col-span-9 sm:col-span-10 flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 mr-4">
                        <Switch
                          id={`${day.toLowerCase()}-closed`}
                          checked={dayHours[day]?.closed}
                          onCheckedChange={value => handleHoursChange(day, 'closed', value)}
                        />
                        <Label htmlFor={`${day.toLowerCase()}-closed`}>Closed</Label>
                      </div>
                      
                      {!dayHours[day]?.closed && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`${day.toLowerCase()}-open`} className="w-12">Open:</Label>
                            <Input
                              id={`${day.toLowerCase()}-open`}
                              type="time"
                              value={dayHours[day]?.open || "09:00"}
                              onChange={e => handleHoursChange(day, 'open', e.target.value)}
                              className="w-32"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`${day.toLowerCase()}-close`} className="w-12">Close:</Label>
                            <Input
                              id={`${day.toLowerCase()}-close`}
                              type="time"
                              value={dayHours[day]?.close || "17:00"}
                              onChange={e => handleHoursChange(day, 'close', e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </>
                      )}
                      
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyFromPreviousDay(index)}
                          className="ml-auto"
                        >
                          Copy from {DAYS[index - 1]}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Special Hours</h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addSpecialHours}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Special Hours
              </Button>
            </div>
            
            {specialHours.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {specialHours.map((special, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 sm:col-span-2">
                          <Input
                            value={special.day}
                            onChange={(e) => {
                              const updated = [...specialHours];
                              updated[index].day = e.target.value;
                              setSpecialHours(updated);
                            }}
                            placeholder="Day/Date"
                          />
                        </div>
                        
                        <div className="col-span-8 sm:col-span-9 flex flex-wrap items-center gap-2">
                          <div className="flex items-center space-x-2 mr-4">
                            <Switch
                              id={`special-${index}-closed`}
                              checked={special.closed}
                              onCheckedChange={(value) => {
                                const updated = [...specialHours];
                                updated[index].closed = value;
                                setSpecialHours(updated);
                              }}
                            />
                            <Label htmlFor={`special-${index}-closed`}>Closed</Label>
                          </div>
                          
                          {!special.closed && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`special-${index}-open`} className="w-12">Open:</Label>
                                <Input
                                  id={`special-${index}-open`}
                                  type="time"
                                  value={special.open}
                                  onChange={(e) => {
                                    const updated = [...specialHours];
                                    updated[index].open = e.target.value;
                                    setSpecialHours(updated);
                                  }}
                                  className="w-32"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`special-${index}-close`} className="w-12">Close:</Label>
                                <Input
                                  id={`special-${index}-close`}
                                  type="time"
                                  value={special.close}
                                  onChange={(e) => {
                                    const updated = [...specialHours];
                                    updated[index].close = e.target.value;
                                    setSpecialHours(updated);
                                  }}
                                  className="w-32"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSpecialHours(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="hours">Hours Display Format</Label>
        </div>
        
        <Textarea
          id="hours"
          placeholder="Business hours"
          {...register("hours")}
          value={formattedHours}
          readOnly
          className="h-20 font-mono text-sm"
        />
        
        <p className="text-xs text-muted-foreground">
          This is how your business hours will display to customers. You can edit the hours above.
        </p>
      </div>
    </div>
  );
};

// Helper functions
function mapShortDayToFull(shortDay: string): string | null {
  const map: Record<string, string> = {
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday",
    "Sat": "Saturday",
    "Sun": "Sunday"
  };
  
  return map[shortDay] || null;
}

function convertTo24HourFormat(timeStr: string): string {
  try {
    // Already in 24-hour format (e.g., "14:00")
    if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
      return timeStr;
    }
    
    // AM/PM format
    const match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)$/i);
    if (!match) return "00:00";
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3].toUpperCase();
    
    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return "00:00";
  }
}

function formatTime(time: string): string {
  try {
    if (!time) return "";
    
    const [hours, minutes] = time.split(':').map(Number);
    let period = "AM";
    
    let displayHours = hours;
    if (hours > 12) {
      displayHours = hours - 12;
      period = "PM";
    } else if (hours === 12) {
      period = "PM";
    } else if (hours === 0) {
      displayHours = 12;
    }
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time;
  }
}

function formatDayGroup(days: string[], hoursString: string): string {
  if (days.length === 1) {
    return `${days[0].substring(0, 3)}: ${hoursString}`;
  }
  
  const firstDay = days[0].substring(0, 3);
  const lastDay = days[days.length - 1].substring(0, 3);
  
  return `${firstDay}-${lastDay}: ${hoursString}`;
}
