
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Globe, Facebook, Instagram, Twitter } from "lucide-react";
import type { BusinessFormValues } from "../BusinessRegistrationForm";
import { businessCategories } from "../utils";

export const BasicInfoStep = () => {
  const { control, register, formState: { errors } } = useFormContext<BusinessFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Info className="mr-2 h-5 w-5 text-primary" />
        Basic Information
      </h2>
      <p className="text-muted-foreground mb-6">
        Let's start with the essential details about your business.
      </p>
      
      {/* Required Fields Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Required Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-6">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business in detail..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of your services, expertise, and what makes your business unique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              control={control}
              name="appointment_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Price (₹) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Standard price for appointments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="consultation_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Price (₹) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Standard price for consultations
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
          
          <div className="mb-6">
            <FormField
              control={control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> Website URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-website.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <h4 className="text-md font-medium mb-3">Social Media Links</h4>
          <div className="space-y-4">
            <FormField
              control={control}
              name="social_media.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/your-page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="social_media.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Instagram className="mr-2 h-4 w-4" /> Instagram
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/your-handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="social_media.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/your-handle" {...field} />
                  </FormControl>
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
