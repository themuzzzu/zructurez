
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/providers/LocationProvider";
import { CreateAdvertisementDto } from "@/types/advertisement";

interface CreateAdCampaignProps {
  businessId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateAdCampaign = ({ businessId, onSuccess, onCancel }: CreateAdCampaignProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as string | null,
    type: "banner",
    format: "standard",
    budget: "",
    reference_id: "",
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month
    location: currentLocation || "",
    targeting_age_min: 18,
    targeting_age_max: 65,
    targeting_gender: "all",
  });

  const handleImageUpload = async (base64Image: string | null) => {
    if (!base64Image) return null;
    
    try {
      // Convert base64 to blob
      const base64Data = base64Image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Upload to Supabase Storage
      const fileName = `ad-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ad-images')
        .upload(fileName, blob);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ad-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Image upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create an ad campaign.",
          variant: "destructive",
        });
        return;
      }
      
      if (!businessId) {
        toast({
          title: "Business ID required",
          description: "A business must be selected to create an ad campaign.",
          variant: "destructive",
        });
        return;
      }

      // Upload image if provided
      const imageUrl = formData.image ? await handleImageUpload(formData.image) : null;
      
      // Format dates for DB
      const startDateStr = format(formData.start_date, 'yyyy-MM-dd');
      const endDateStr = format(formData.end_date, 'yyyy-MM-dd');
      
      // Prepare data for insertion
      const adData: CreateAdvertisementDto = {
        user_id: user.id,
        business_id: businessId,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl || '',
        type: formData.type,
        format: formData.format,
        reference_id: formData.reference_id || '',
        budget: parseFloat(formData.budget) || 0,
        start_date: startDateStr,
        end_date: endDateStr,
        location: formData.location,
        targeting_age_min: formData.targeting_age_min,
        targeting_age_max: formData.targeting_age_max,
        targeting_gender: formData.targeting_gender,
      };
      
      // Insert ad campaign
      const { data, error } = await supabase
        .from('advertisements')
        .insert(adData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Ad campaign created successfully",
        description: "Your ad campaign is now pending review.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating ad campaign:", error);
      toast({
        title: "Failed to create ad campaign",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Ad Campaign</CardTitle>
          <CardDescription>
            Set up a new advertising campaign for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Summer Sale Promotion"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your ad campaign"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Ad Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner Ad</SelectItem>
                    <SelectItem value="sponsored">Sponsored Listing</SelectItem>
                    <SelectItem value="flash-deal">Flash Deal</SelectItem>
                    <SelectItem value="recommended">Recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Ad Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => handleChange('format', value)}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select ad format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Banner</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="native">Native Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Ad Image</Label>
                <ImageUpload
                  selectedImage={formData.image}
                  onImageSelect={(image) => handleChange('image', image)}
                />
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="100"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="1000"
                  required
                />
                <p className="text-sm text-muted-foreground">Minimum budget is ₹100</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.start_date}
                        onSelect={(date) => date && handleChange('start_date', date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.end_date}
                        onSelect={(date) => date && handleChange('end_date', date)}
                        initialFocus
                        disabled={(date) => date <= formData.start_date}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Target Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Target location"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Target Age Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="13"
                    max="100"
                    value={formData.targeting_age_min}
                    onChange={(e) => handleChange('targeting_age_min', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    min="13"
                    max="100"
                    value={formData.targeting_age_max}
                    onChange={(e) => handleChange('targeting_age_max', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targeting_gender">Target Gender</Label>
                <Select
                  value={formData.targeting_gender}
                  onValueChange={(value) => handleChange('targeting_gender', value)}
                >
                  <SelectTrigger id="targeting_gender">
                    <SelectValue placeholder="Select target gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === 1 ? (
            <>
              <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
              <Button type="button" onClick={() => setStep(2)}>Next</Button>
            </>
          ) : (
            <>
              <Button variant="outline" type="button" onClick={() => setStep(1)}>Back</Button>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateAdCampaign;
