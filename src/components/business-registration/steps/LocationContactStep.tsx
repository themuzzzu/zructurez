
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { MapLocationSelector } from "@/components/create-service/MapLocationSelector";
import type { BusinessFormValues } from "../BusinessRegistrationForm";

export const LocationContactStep = () => {
  const { control, setValue, watch, formState: { errors } } = useFormContext<BusinessFormValues>();
  
  const locationValue = watch("location");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        Location & Contact
      </h2>
      <p className="text-muted-foreground mb-6">
        Set your business location and contact information.
      </p>
      
      {/* Required Fields Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Required Information</h3>
          
          <div className="space-y-6">
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <MapLocationSelector
                      value={field.value}
                      onChange={(location) => {
                        field.onChange(location);
                        setValue("location", location);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your business address or select on the map
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> Contact Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Phone number" 
                      {...field} 
                      type="tel"
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used as the primary contact for your business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Optional Fields Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Optional Information</h3>
          
          <div className="space-y-6">
            <FormField
              control={control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="WhatsApp number (if different from contact)" 
                      {...field} 
                      type="tel"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if same as contact number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="business@example.com" 
                      {...field} 
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* OTP verification would be added here, but marked as optional in requirements */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
