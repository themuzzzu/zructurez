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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  FileText, 
  Globe, 
  CircleDollarSign,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { BusinessFormValues } from "../BusinessRegistrationForm";

const BUSINESS_CATEGORIES = [
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "food", label: "Food & Dining" },
  { value: "retail", label: "Retail" },
  { value: "health", label: "Health & Medical" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "automotive", label: "Automotive" },
  { value: "home", label: "Home Services" },
  { value: "professional", label: "Professional Services" },
  { value: "other", label: "Other" }
];

export const BasicInfoStep = () => {
  const { control, watch } = useFormContext<BusinessFormValues>();
  const categoryValue = watch("category");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Building2 className="mr-2 h-5 w-5 text-primary" />
        Basic Business Information
      </h2>
      <p className="text-muted-foreground mb-6">
        Let's start with the essentials. Tell us about your business.
      </p>
      
      {/* Business Name */}
      <Card>
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Stellar Café" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the official name of your business
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Business Category */}
      <Card>
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Category <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the category that best describes your business
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Other Category Input - only shows when "other" is selected */}
          {categoryValue === "other" && (
            <FormField
              control={control}
              name="otherCategory"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Specify Your Category <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Pet Services" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please specify your business category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Business Description */}
      <Card>
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell customers about your business..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of your business, services offered, and what makes you unique
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Pricing Information - now optional */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Pricing Information (Optional)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="appointment_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Price (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="E.g., 1000"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if not applicable
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
                  <FormLabel>Consultation Price (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="E.g., 500"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if not applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Website & Social Media */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Online Presence (Optional)</h3>
          </div>
          
          <FormField
            control={control}
            name="website"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://yourbusiness.com" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter the URL of your business website
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium">Social Media Links</h4>
            
            <FormField
              control={control}
              name="social_media.facebook"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                    <FormLabel>Facebook</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="https://facebook.com/yourbusiness" 
                      {...field} 
                    />
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
                  <div className="flex items-center">
                    <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                    <FormLabel>Instagram</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="https://instagram.com/yourbusiness" 
                      {...field} 
                    />
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
                  <div className="flex items-center">
                    <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                    <FormLabel>Twitter</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="https://twitter.com/yourbusiness" 
                      {...field} 
                    />
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
