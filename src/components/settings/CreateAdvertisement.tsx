
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LocationSelector } from "@/components/LocationSelector";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdFormat } from "@/services/adService";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const CreateAdvertisement = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"business" | "service" | "product">("business");
  const [format, setFormat] = useState<AdFormat>("standard");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedItemId, setSelectedItemId] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  
  // Targeting options
  const [showTargeting, setShowTargeting] = useState(false);
  const [targetingLocations, setTargetingLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [targetingInterests, setTargetingInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState<string>("18");
  const [targetAgeMax, setTargetAgeMax] = useState<string>("65");
  const [targetGender, setTargetGender] = useState<string>("all");

  const { data: businesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: services } = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: products } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: posts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: format === 'boosted_post'
  });

  const addCarouselImage = (imageUrl: string) => {
    if (carouselImages.length < 5) {
      setCarouselImages([...carouselImages, imageUrl]);
    } else {
      toast.error("Maximum 5 images allowed in carousel");
    }
  };

  const removeCarouselImage = (index: number) => {
    const updatedImages = [...carouselImages];
    updatedImages.splice(index, 1);
    setCarouselImages(updatedImages);
  };

  const addTargetingLocation = () => {
    if (newLocation && !targetingLocations.includes(newLocation)) {
      setTargetingLocations([...targetingLocations, newLocation]);
      setNewLocation("");
    }
  };

  const removeTargetingLocation = (location: string) => {
    setTargetingLocations(targetingLocations.filter(loc => loc !== location));
  };

  const addTargetingInterest = () => {
    if (newInterest && !targetingInterests.includes(newInterest)) {
      setTargetingInterests([...targetingInterests, newInterest]);
      setNewInterest("");
    }
  };

  const removeTargetingInterest = (interest: string) => {
    setTargetingInterests(targetingInterests.filter(int => int !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedItemId || !budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let finalImageUrl = imageUrl;
      if (imageUrl && imageUrl.startsWith('data:')) {
        const timestamp = Date.now();
        const fileName = `ad-${timestamp}.jpg`;
        
        // Convert base64 to blob
        const base64Data = imageUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // Process carousel images if needed
      let finalCarouselImages: string[] = [];
      if (format === 'carousel' && carouselImages.length > 0) {
        for (let i = 0; i < carouselImages.length; i++) {
          const image = carouselImages[i];
          if (image.startsWith('data:')) {
            const timestamp = Date.now();
            const fileName = `carousel-${timestamp}-${i}.jpg`;
            
            // Convert base64 to blob
            const base64Data = image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('business-images')
              .upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('business-images')
              .getPublicUrl(fileName);

            finalCarouselImages.push(publicUrl);
          } else {
            finalCarouselImages.push(image);
          }
        }
      }

      const { error } = await supabase.from('advertisements').insert({
        user_id: user.id,
        title,
        description,
        type,
        format,
        reference_id: selectedItemId,
        location,
        budget: parseFloat(budget),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        image_url: finalImageUrl,
        video_url: format === 'video' ? videoUrl : null,
        carousel_images: format === 'carousel' ? finalCarouselImages : null,
        targeting_locations: targetingLocations.length > 0 ? targetingLocations : null,
        targeting_interests: targetingInterests.length > 0 ? targetingInterests : null,
        targeting_age_min: targetAgeMin ? parseInt(targetAgeMin) : null,
        targeting_age_max: targetAgeMax ? parseInt(targetAgeMax) : null,
        targeting_gender: targetGender !== 'all' ? targetGender : null,
      });

      if (error) throw error;
      toast.success("Advertisement created successfully");
      onClose();
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast.error("Failed to create advertisement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Advertisement Type</Label>
        <Select value={type} onValueChange={(value: "business" | "service" | "product") => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="product">Product</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Ad Format</Label>
        <Select value={format} onValueChange={(value: AdFormat) => setFormat(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Ad</SelectItem>
            <SelectItem value="banner">Banner Ad</SelectItem>
            <SelectItem value="carousel">Carousel Ad</SelectItem>
            <SelectItem value="video">Video Ad</SelectItem>
            <SelectItem value="boosted_post">Boost Existing Post</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {format === 'boosted_post' ? (
        <div>
          <Label>Select Post to Boost</Label>
          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
            <SelectTrigger>
              <SelectValue placeholder="Select post" />
            </SelectTrigger>
            <SelectContent>
              {posts?.map((post) => (
                <SelectItem key={post.id} value={post.id}>
                  {post.content.substring(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label>Select {type}</Label>
          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${type}`} />
            </SelectTrigger>
            <SelectContent>
              {type === "business" && businesses?.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
              {type === "service" && services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title}
                </SelectItem>
              ))}
              {type === "product" && products?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Advertisement Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>

      {format === 'standard' && (
        <div>
          <Label>Advertisement Image</Label>
          <ImageUpload
            selectedImage={imageUrl}
            onImageSelect={setImageUrl}
            skipAutoSave
          />
        </div>
      )}

      {format === 'banner' && (
        <div>
          <Label>Banner Image (recommended: 1200×300px)</Label>
          <ImageUpload
            selectedImage={imageUrl}
            onImageSelect={setImageUrl}
            skipAutoSave
          />
          <p className="text-sm text-muted-foreground mt-1">Banner ads appear at prominent locations like the top of marketplace</p>
        </div>
      )}

      {format === 'carousel' && (
        <div className="space-y-4">
          <Label>Carousel Images (2-5 images)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {carouselImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                <img 
                  src={image} 
                  alt={`Carousel image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="absolute top-1 right-1"
                  type="button"
                  onClick={() => removeCarouselImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {carouselImages.length < 5 && (
              <div className="aspect-square border border-dashed rounded-md flex items-center justify-center">
                <ImageUpload
                  selectedImage={null}
                  onImageSelect={(url) => url && addCarouselImage(url)}
                  skipAutoSave
                  buttonText="Add Image"
                />
              </div>
            )}
          </div>
          {carouselImages.length < 2 && (
            <p className="text-sm text-yellow-500">Add at least 2 images for carousel</p>
          )}
        </div>
      )}

      {format === 'video' && (
        <div>
          <Label>Video URL (YouTube, Vimeo)</Label>
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=..."
            required
          />
          <p className="text-sm text-muted-foreground mt-1">Enter a valid video URL from YouTube or Vimeo</p>
        </div>
      )}

      <div>
        <Label>Location</Label>
        <LocationSelector value={location} onChange={setLocation} />
      </div>

      <div>
        <Label>Budget (₹)</Label>
        <Input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter budget in rupees"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            disabled={(date) => date < new Date()}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            disabled={(date) => !startDate || date < startDate}
          />
        </div>
      </div>

      <div className="border p-4 rounded-md">
        <button 
          type="button" 
          className="flex items-center justify-between w-full font-medium"
          onClick={() => setShowTargeting(!showTargeting)}
        >
          Advanced Targeting Options
          {showTargeting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {showTargeting && (
          <div className="mt-4 space-y-4">
            <div>
              <Label>Target Locations</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add location"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addTargetingLocation}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetingLocations.map((loc) => (
                  <div key={loc} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {loc}
                    <button 
                      type="button" 
                      onClick={() => removeTargetingLocation(loc)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Target Interests</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add interest (e.g. fashion, sports)"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addTargetingInterest}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetingInterests.map((interest) => (
                  <div key={interest} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {interest}
                    <button 
                      type="button" 
                      onClick={() => removeTargetingInterest(interest)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={targetAgeMin}
                    onChange={(e) => setTargetAgeMin(e.target.value)}
                    placeholder="Min"
                    min="13"
                    max="100"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={targetAgeMax}
                    onChange={(e) => setTargetAgeMax(e.target.value)}
                    placeholder="Max"
                    min={targetAgeMin || "13"}
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <Label>Target Gender</Label>
                <Select value={targetGender} onValueChange={setTargetGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Advertisement"}
        </Button>
      </div>
    </form>
  );
};
