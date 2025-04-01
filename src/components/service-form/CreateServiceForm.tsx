
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ServiceFormFields } from "@/components/create-service/ServiceFormFields";
import { validatePhoneNumber } from "@/components/create-service/validation";
import { ImageUpload } from "@/components/ImageUpload";
import type { ServiceFormData, CreateServiceFormProps } from "@/components/create-service/ServiceFormTypes";

export const CreateServiceForm = ({ onSuccess, onCancel }: CreateServiceFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contact_info: "",
    availability: "",
    image: null,
    works: []
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleChange = (name: string, value: string | any[] | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImage = async (imageFile: string) => {
    try {
      const base64Data = imageFile.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, blob);

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
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // First, create the service
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert([{
          user_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          location: formData.location,
          contact_info: formData.contact_info,
          availability: formData.availability,
          image_url: imageUrl,
        }])
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Then, upload works if any
      if (formData.works && formData.works.length > 0) {
        for (const work of formData.works) {
          let workImageUrl = null;
          if (work.media) {
            workImageUrl = await uploadImage(work.media);
          }

          const { error: portfolioError } = await supabase
            .from('service_portfolio')
            .insert([{
              service_id: service.id,
              title: formData.title,
              description: work.description,
              image_url: workImageUrl
            }]);

          if (portfolioError) throw portfolioError;
        }
      }

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
      <ServiceFormFields formData={formData} onChange={handleChange} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Service Image</label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => handleChange('image', image)}
        />
      </div>
      
      <div className="flex gap-2 justify-end">
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
