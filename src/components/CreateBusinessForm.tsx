import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MapLocationSelector } from "./create-service/MapLocationSelector";

interface CreateBusinessFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateBusinessForm = ({ onSuccess, onCancel }: CreateBusinessFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    contact: "",
    hours: "",
    image: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let imageUrl = null;
      if (formData.image) {
        const base64Data = formData.image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .insert([{
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          contact: formData.contact,
          hours: formData.hours,
          image_url: imageUrl,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Business registered successfully!");
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to register business. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your business name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="driving-school">Driving School</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="beauty">Beauty & Wellness</SelectItem>
            <SelectItem value="professional">Professional Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your business"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <MapLocationSelector
          value={formData.location}
          onChange={(location) => setFormData({ ...formData, location })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Information</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder="Phone number or email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Business Hours</Label>
        <Input
          id="hours"
          value={formData.hours}
          onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
          placeholder="e.g., Mon-Fri: 9AM-5PM"
        />
      </div>

      <div className="space-y-2">
        <Label>Business Image</Label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => setFormData({ ...formData, image })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Business"}
        </Button>
      </div>
    </form>
  );
};