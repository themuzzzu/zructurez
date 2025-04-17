
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdvertisement } from "@/services/adService";
import { useAuth } from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, ImageIcon, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const adCampaignSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.string().min(1, { message: "Please select an ad type" }),
  location: z.string().min(1, { message: "Please select a location" }),
  format: z.string().default("standard"),
  reference_id: z.string().optional(),
  budget: z.coerce.number().min(10, { message: "Minimum budget is $10" }),
  start_date: z.date(),
  end_date: z.date(),
  image_url: z.string().optional(),
  targeting_age_min: z.coerce.number().optional(),
  targeting_age_max: z.coerce.number().optional(),
  targeting_gender: z.string().optional(),
});

interface CreateAdCampaignProps {
  onSuccess: () => void;
  onCancel: () => void;
  businessId?: string;
}

export const CreateAdCampaign = ({ onSuccess, onCancel, businessId }: CreateAdCampaignProps) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("basic");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Query business products if a business ID is provided
  const { data: businessProducts = [] } = useQuery({
    queryKey: ["business-products", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from("business_products")
        .select("id, name")
        .eq("business_id", businessId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });
  
  // Form setup
  const form = useForm<z.infer<typeof adCampaignSchema>>({
    resolver: zodResolver(adCampaignSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      location: "",
      format: "standard",
      budget: 100,
      reference_id: businessId || "",
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      image_url: "",
    },
  });
  
  // Get form values
  const watchType = form.watch("type");
  const watchLocation = form.watch("location");
  
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
      const filePath = `ads/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      const imageUrl = urlData.publicUrl;
      
      // Set the image URL in the form and show preview
      form.setValue("image_url", imageUrl);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof adCampaignSchema>) => {
    if (!user) {
      console.error("User not authenticated");
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
      
      const { success, error } = await createAdvertisement(adData);
      
      if (!success) {
        throw new Error(error || "Failed to create advertisement");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error creating ad campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Conditional rendering based on the current step
  const renderFormStep = () => {
    switch (formStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ad title" {...field} />
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
                    <FormLabel>Where to Display</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="home">Home Page</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="business">Business Section</SelectItem>
                        <SelectItem value="services">Services Section</SelectItem>
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
                          <SelectValue placeholder="Select format" />
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
              
              {/* Reference ID - show only for sponsored products/services */}
              {(watchType === "sponsored_product" || watchType === "sponsored_service" || 
                 watchType === "recommended_service") && (
                <FormField
                  control={form.control}
                  name="reference_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {watchType === "sponsored_product" ? "Product" : "Service"}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${watchType === "sponsored_product" ? "product" : "service"}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
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
        );
      
      case 1:
        return (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <FormLabel className="block mb-2">Ad Image</FormLabel>
              <FormDescription className="mb-4">
                Upload an image for your ad. Recommended size: 1200x628px.
              </FormDescription>
              <div className="border border-dashed rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Ad preview"
                      className="max-h-64 mx-auto rounded-md object-contain"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("image_url", "");
                          setImagePreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No image selected
                    </p>
                    <Button
                      type="button"
                      onClick={() => document.getElementById("ad-image")?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Upload Image"}
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
            
            {/* Targeting Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Targeting Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Age Range */}
                <FormField
                  control={form.control}
                  name="targeting_age_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="18" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targeting_age_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="65" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="targeting_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All genders" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">All genders</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Total Budget ($)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the maximum amount you'll spend on this campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
            </div>
            
            <Separator />
            
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
                <CardDescription>Review your campaign details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ad Type:</span>
                  <span className="font-medium">{watchType || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{watchLocation || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {form.getValues("start_date") && form.getValues("end_date")
                      ? `${format(form.getValues("start_date"), "MMM d")} - ${format(form.getValues("end_date"), "MMM d, yyyy")}`
                      : "Not selected"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total Budget:</span>
                  <span>${form.getValues("budget") || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 rounded-b-lg">
                <div className="w-full text-center py-2">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="text-xs">You'll be charged once your ad is approved</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Create Ad Campaign</h2>
        <p className="text-sm text-muted-foreground">
          Set up your ad campaign to reach more customers
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="hidden">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="budget">Budget & Schedule</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center">
        {[0, 1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                formStep === step
                  ? "bg-primary text-primary-foreground"
                  : formStep > step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step + 1}
            </div>
            {step < 2 && (
              <div
                className={cn(
                  "h-1 w-12",
                  formStep > step ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        {formStep === 0 && <h3 className="text-lg font-medium mb-4">Basic Information</h3>}
        {formStep === 1 && <h3 className="text-lg font-medium mb-4">Creative & Targeting</h3>}
        {formStep === 2 && <h3 className="text-lg font-medium mb-4">Budget & Schedule</h3>}
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderFormStep()}
          
          <div className="flex justify-between mt-6">
            {formStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormStep((prev) => prev - 1)}
              >
                Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            
            {formStep < 2 ? (
              <Button
                type="button"
                onClick={() => {
                  // Validate current step before proceeding
                  if (formStep === 0) {
                    form.trigger(["title", "description", "type", "location", "format", "reference_id"]);
                    if (
                      !form.formState.errors.title &&
                      !form.formState.errors.description &&
                      !form.formState.errors.type &&
                      !form.formState.errors.location &&
                      !form.formState.errors.format
                    ) {
                      setFormStep((prev) => prev + 1);
                    }
                  } else if (formStep === 1) {
                    setFormStep((prev) => prev + 1);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAdCampaign;
