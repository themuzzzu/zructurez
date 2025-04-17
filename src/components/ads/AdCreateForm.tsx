
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { createAdvertisement } from "@/services/adService";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define form schema
const adFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Please select an ad type"),
  location: z.string().min(1, "Please select an ad location"),
  format: z.string().default("standard"),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
  budget: z.coerce.number().positive("Budget must be positive"),
  reference_id: z.string().optional(),
  image_url: z.string().optional(),
});

interface AdCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  businessId?: string;
}

export const AdCreateForm = ({ onSuccess, onCancel, businessId }: AdCreateFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof adFormSchema>>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      location: "",
      format: "standard",
      budget: 100,
      reference_id: businessId || "",
      image_url: "",
    },
  });
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadingImage(true);
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `ad-images/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('ads')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('ads')
        .getPublicUrl(filePath);
        
      const imageUrl = urlData.publicUrl;
      
      // Update form
      form.setValue("image_url", imageUrl);
      setImagePreview(imageUrl);
      
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Image upload failed",
        description: "Please try again or use a different image",
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle form submit
  const onSubmit = async (values: z.infer<typeof adFormSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create an ad",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const adData = {
        ...values,
        user_id: user.id,
        business_id: businessId,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
      };
      
      const { success, error, id } = await createAdvertisement(adData);
      
      if (!success) {
        throw new Error(error || "Failed to create advertisement");
      }
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create ad",
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Create New Ad Campaign</h2>
        <p className="text-sm text-muted-foreground">
          Design your campaign and reach your target audience
        </p>
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ad Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy title for your ad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Ad Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="banner">Banner Ad</SelectItem>
                      <SelectItem value="flash_deal">Flash Deal</SelectItem>
                      <SelectItem value="sponsored_product">Sponsored Product</SelectItem>
                      <SelectItem value="sponsored_business">Sponsored Business</SelectItem>
                      <SelectItem value="recommended_service">Recommended Service</SelectItem>
                      <SelectItem value="sponsored_service">Sponsored Service</SelectItem>
                      <SelectItem value="in_content">In-Content Ad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home Page</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="business">Business Section</SelectItem>
                      <SelectItem value="services">Services Section</SelectItem>
                      <SelectItem value="product_detail">Product Detail Pages</SelectItem>
                      <SelectItem value="business_detail">Business Detail Pages</SelectItem>
                      <SelectItem value="service_detail">Service Detail Pages</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Format */}
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="boosted_post">Boosted Post</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Budget */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter your budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image Upload */}
            <div className="col-span-1 md:col-span-2">
              <FormLabel className="block mb-2">Ad Image</FormLabel>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img 
                          src={imagePreview}
                          alt="Ad preview"
                          className="w-full h-48 object-contain rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            form.setValue("image_url", "");
                            setImagePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload an image for your ad
                        </p>
                        <Button 
                          type="button" 
                          variant="outline"
                          disabled={uploadingImage}
                          onClick={() => document.getElementById("ad-image")?.click()}
                        >
                          {uploadingImage ? "Uploading..." : "Select Image"}
                        </Button>
                        <input
                          id="ad-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Start Date */}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* End Date */}
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < new Date() || 
                          (form.getValues("start_date") && date < form.getValues("start_date"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Ad Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your ad and what you're promoting" 
                      {...field} 
                      className="min-h-[120px]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ad Campaign"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdCreateForm;
