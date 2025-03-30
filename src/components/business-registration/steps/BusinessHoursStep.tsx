
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  CalendarDays,
  IndianRupee,
  Copy
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { BusinessFormValues } from "../BusinessRegistrationForm";
import { formatCurrency } from "../utils";
import { toast } from "@/components/ui/use-toast";

// Days of the week for business hours
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Time options for the select dropdown
const TIME_OPTIONS = [
  "Closed",
  "Open 24 Hours",
  "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
  "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM",
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
];

// Standard hours templates
const HOURS_TEMPLATES = [
  {
    name: "Regular Business (9-5)",
    hours: {
      Monday: { open: "9:00 AM", close: "5:00 PM" },
      Tuesday: { open: "9:00 AM", close: "5:00 PM" },
      Wednesday: { open: "9:00 AM", close: "5:00 PM" },
      Thursday: { open: "9:00 AM", close: "5:00 PM" },
      Friday: { open: "9:00 AM", close: "5:00 PM" },
      Saturday: { open: "Closed", close: "Closed" },
      Sunday: { open: "Closed", close: "Closed" },
    }
  },
  {
    name: "Extended Hours (8-8)",
    hours: {
      Monday: { open: "8:00 AM", close: "8:00 PM" },
      Tuesday: { open: "8:00 AM", close: "8:00 PM" },
      Wednesday: { open: "8:00 AM", close: "8:00 PM" },
      Thursday: { open: "8:00 AM", close: "8:00 PM" },
      Friday: { open: "8:00 AM", close: "8:00 PM" },
      Saturday: { open: "10:00 AM", close: "6:00 PM" },
      Sunday: { open: "Closed", close: "Closed" },
    }
  },
  {
    name: "Retail Hours (10-7)",
    hours: {
      Monday: { open: "10:00 AM", close: "7:00 PM" },
      Tuesday: { open: "10:00 AM", close: "7:00 PM" },
      Wednesday: { open: "10:00 AM", close: "7:00 PM" },
      Thursday: { open: "10:00 AM", close: "7:00 PM" },
      Friday: { open: "10:00 AM", close: "7:00 PM" },
      Saturday: { open: "10:00 AM", close: "7:00 PM" },
      Sunday: { open: "11:00 AM", close: "5:00 PM" },
    }
  },
  {
    name: "Restaurant Hours (11-10)",
    hours: {
      Monday: { open: "11:00 AM", close: "10:00 PM" },
      Tuesday: { open: "11:00 AM", close: "10:00 PM" },
      Wednesday: { open: "11:00 AM", close: "10:00 PM" },
      Thursday: { open: "11:00 AM", close: "10:00 PM" },
      Friday: { open: "11:00 AM", close: "11:00 PM" },
      Saturday: { open: "11:00 AM", close: "11:00 PM" },
      Sunday: { open: "12:00 PM", close: "9:00 PM" },
    }
  },
  {
    name: "Weekend Only",
    hours: {
      Monday: { open: "Closed", close: "Closed" },
      Tuesday: { open: "Closed", close: "Closed" },
      Wednesday: { open: "Closed", close: "Closed" },
      Thursday: { open: "Closed", close: "Closed" },
      Friday: { open: "Closed", close: "Closed" },
      Saturday: { open: "9:00 AM", close: "6:00 PM" },
      Sunday: { open: "9:00 AM", close: "6:00 PM" },
    }
  }
];

export const BusinessHoursStep = () => {
  const { control, setValue, watch, formState: { errors } } = useFormContext<BusinessFormValues>();
  const [customHours, setCustomHours] = useState(false);
  const [dayHours, setDayHours] = useState<Record<string, { open: string; close: string }>>({
    Monday: { open: "9:00 AM", close: "6:00 PM" },
    Tuesday: { open: "9:00 AM", close: "6:00 PM" },
    Wednesday: { open: "9:00 AM", close: "6:00 PM" },
    Thursday: { open: "9:00 AM", close: "6:00 PM" },
    Friday: { open: "9:00 AM", close: "6:00 PM" },
    Saturday: { open: "10:00 AM", close: "4:00 PM" },
    Sunday: { open: "Closed", close: "Closed" },
  });
  
  const is24_7 = watch("is_24_7");
  const appointmentPrice = watch("appointment_price");
  const consultationPrice = watch("consultation_price");
  
  const updateHoursText = () => {
    if (is24_7) {
      setValue("hours", "Open 24/7");
      return;
    }
    
    if (!customHours) {
      setValue("hours", "Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM, Sun: Closed");
      return;
    }
    
    // Format the custom hours into a string
    const formattedHours = DAYS.map(day => {
      const dayData = dayHours[day];
      if (!dayData || dayData.open === "Closed") {
        return `${day.slice(0, 3)}: Closed`;
      }
      if (dayData.open === "Open 24 Hours") {
        return `${day.slice(0, 3)}: Open 24 Hours`;
      }
      return `${day.slice(0, 3)}: ${dayData.open} - ${dayData.close}`;
    }).join(", ");
    
    setValue("hours", formattedHours);
  };
  
  // Watch for changes in 24/7 toggle
  const handle24_7Change = (checked: boolean) => {
    setValue("is_24_7", checked);
    updateHoursText();
  };
  
  // Watch for changes in custom hours toggle
  const handleCustomHoursChange = (checked: boolean) => {
    setCustomHours(checked);
    updateHoursText();
  };
  
  // Update day hours
  const updateDayHours = (day: string, type: 'open' | 'close', value: string) => {
    setDayHours(prev => {
      const newHours = {
        ...prev,
        [day]: {
          ...prev[day],
          [type]: value
        }
      };
      
      // Special handling for "Closed" and "Open 24 Hours"
      if (type === 'open' && (value === 'Closed' || value === 'Open 24 Hours')) {
        newHours[day].close = value;
      }
      
      setTimeout(() => {
        updateHoursText();
      }, 0);
      
      return newHours;
    });
  };
  
  // Apply a template of standard hours
  const applyHoursTemplate = (templateIndex: number) => {
    if (templateIndex >= 0 && templateIndex < HOURS_TEMPLATES.length) {
      setDayHours(HOURS_TEMPLATES[templateIndex].hours);
      setCustomHours(true);
      
      setTimeout(() => {
        updateHoursText();
        toast({
          title: "Hours template applied",
          description: `Applied the "${HOURS_TEMPLATES[templateIndex].name}" template`,
        });
      }, 0);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Clock className="mr-2 h-5 w-5 text-primary" />
        Business Hours & Pricing
      </h2>
      <p className="text-muted-foreground mb-6">
        Set your business operating hours and confirm pricing.
      </p>
      
      {/* Business Hours Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Business Hours</h3>
          
          <div className="space-y-6">
            <FormField
              control={control}
              name="is_24_7"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Open 24/7</FormLabel>
                    <FormDescription>
                      Toggle on if your business is open 24 hours a day, 7 days a week
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handle24_7Change(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {!is24_7 && (
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Custom Hours</FormLabel>
                    <FormDescription>
                      Set different hours for each day of the week
                    </FormDescription>
                  </div>
                  <Switch
                    checked={customHours}
                    onCheckedChange={handleCustomHoursChange}
                  />
                </div>
                
                {customHours ? (
                  <div className="space-y-4 mt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" /> Standard Hours Templates
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {HOURS_TEMPLATES.map((template, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            size="sm"
                            onClick={() => applyHoursTemplate(index)}
                            className="text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" /> Set Hours Per Day
                    </h4>
                    
                    <div className="space-y-2">
                      {DAYS.map((day) => (
                        <div key={day} className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-sm font-medium">{day}</div>
                          <Select
                            value={dayHours[day]?.open || "9:00 AM"}
                            onValueChange={(value) => updateDayHours(day, 'open', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Opening time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((time) => (
                                <SelectItem key={`${day}-open-${time}`} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {dayHours[day]?.open !== "Closed" && dayHours[day]?.open !== "Open 24 Hours" && (
                            <Select
                              value={dayHours[day]?.close || "6:00 PM"}
                              onValueChange={(value) => updateDayHours(day, 'close', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Closing time" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_OPTIONS.filter(time => 
                                  time !== "Closed" && time !== "Open 24 Hours"
                                ).map((time) => (
                                  <SelectItem key={`${day}-close-${time}`} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          
                          {(dayHours[day]?.open === "Closed" || dayHours[day]?.open === "Open 24 Hours") && (
                            <div className="text-sm text-muted-foreground">
                              {dayHours[day]?.open === "Closed" ? "Closed All Day" : "Open All Day"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Standard Business Hours <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM, Sun: Closed"
                              {...field}
                              disabled={is24_7}
                              value={is24_7 ? "Open 24/7" : field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify your general business hours
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Pricing Confirmation Section - Now editable */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Pricing Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="appointment_price"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <div className="flex items-center mb-2">
                    <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                    <FormLabel className="text-base font-medium">Appointment Price</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Leave empty if not applicable"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs mt-2">
                    Standard appointment pricing (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="consultation_price"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <div className="flex items-center mb-2">
                    <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                    <FormLabel className="text-base font-medium">Consultation Price</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Leave empty if not applicable"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs mt-2">
                    Standard consultation pricing (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
