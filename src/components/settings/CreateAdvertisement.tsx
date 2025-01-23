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

export const CreateAdvertisement = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"business" | "service" | "product">("business");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedItemId, setSelectedItemId] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

      const { error } = await supabase.from('advertisements').insert({
        user_id: user.id,
        title,
        description,
        type,
        reference_id: selectedItemId,
        location,
        budget: parseFloat(budget),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        image_url: finalImageUrl,
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

      <div>
        <Label>Advertisement Image</Label>
        <ImageUpload
          selectedImage={imageUrl}
          onImageSelect={setImageUrl}
          skipAutoSave
        />
      </div>

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