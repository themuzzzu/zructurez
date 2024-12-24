import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LocationSelector } from "./LocationSelector";
import { CategorySelect } from "./create-service/CategorySelect";
import { validatePhoneNumber } from "./create-service/validation";
import { ImageUpload } from "./ImageUpload";
import type { ServiceFormData, CreateServiceFormProps } from "./create-service/types";

export const CreateServiceForm = ({ onSuccess }: CreateServiceFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contact_info: "",
    availability: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImage = async (imageFile: string) => {
    try {
      const fileName = `${userId}/${crypto.randomUUID()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in to create a service");
      return;
    }

    if (!validatePhoneNumber(formData.contact_info)) {
      toast.error("Please enter a valid Indian mobile number (+91XXXXXXXXXX or 10 digits)");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const { error } = await supabase.from('services').insert([
        {
          user_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          location: formData.location,
          contact_info: formData.contact_info,
          availability: formData.availability,
          image_url: imageUrl
        }
      ]);

      if (error) throw error;

      toast.success("Service created successfully!");
      onSuccess?.();
      navigate('/services');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Service Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <CategorySelect 
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        />
      </div>

      <div className="space-y-2">
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <LocationSelector
          value={formData.location}
          onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
        />
      </div>

      <div className="space-y-2">
        <Input
          name="contact_info"
          placeholder="Contact Number (e.g., +91XXXXXXXXXX)"
          value={formData.contact_info}
          onChange={handleChange}
          pattern="^(\+91[-\s]?)?[0-9]{10}$"
          title="Please enter a valid Indian mobile number (+91XXXXXXXXXX or 10 digits)"
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          name="availability"
          placeholder="Availability (e.g., Mon-Fri 9AM-5PM)"
          value={formData.availability}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <ImageUpload
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Service"}
      </Button>
    </form>
  );
};