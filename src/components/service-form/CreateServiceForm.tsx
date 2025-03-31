
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

interface CreateServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateServiceForm = ({ onSuccess, onCancel }: CreateServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contact_info: "",
    availability: "",
    image: null as string | null,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a service");
        return;
      }
      
      let imageUrl = null;
      if (formData.image) {
        // Convert the base64 image to a blob
        const base64Data = formData.image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Upload the image to Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }
      
      // Create the service
      const { data, error } = await supabase
        .from('services')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            location: formData.location,
            contact_info: formData.contact_info,
            availability: formData.availability,
            image_url: imageUrl,
            user_id: user.id,
            is_open: true
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Service created successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Service Title*</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter service title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your service"
          className="min-h-[100px]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category*</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home Services</SelectItem>
            <SelectItem value="health">Health & Wellness</SelectItem>
            <SelectItem value="tech">Tech Support</SelectItem>
            <SelectItem value="education">Education & Tutoring</SelectItem>
            <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
            <SelectItem value="events">Events & Entertainment</SelectItem>
            <SelectItem value="professional">Professional Services</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="creative">Creative Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price*</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="Enter price"
          min="0"
          step="0.01"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Where is this service available?"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Information</Label>
        <Input
          id="contact_info"
          value={formData.contact_info}
          onChange={(e) => handleChange('contact_info', e.target.value)}
          placeholder="How can customers reach you?"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Input
          id="availability"
          value={formData.availability}
          onChange={(e) => handleChange('availability', e.target.value)}
          placeholder="When is this service available? (e.g., Mon-Fri, 9am-5pm)"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Service Image</Label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => handleChange('image', image)}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Service"}
        </Button>
      </div>
    </form>
  );
};
