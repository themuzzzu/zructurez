import { Button } from "./ui/button";
import { ImageUpload } from "./ImageUpload";
import { BusinessBasicInfo } from "./business-form/BusinessBasicInfo";
import { BusinessPricing } from "./business-form/BusinessPricing";
import { BusinessContactInfo } from "./business-form/BusinessContactInfo";
import { BusinessProfileInfo } from "./business-form/BusinessProfileInfo";
import { Label } from "./ui/label";
import { useBusinessForm } from "./business-form/useBusinessForm";
import type { FormProps } from "./business-form/types/form";

// Test data for quick business creation
const TEST_BUSINESS = {
  name: "Serenity Spa & Wellness Center",
  category: "beauty",
  description: "A luxurious spa & wellness center offering a comprehensive range of treatments including massage therapy, skincare services, yoga classes, and holistic healing practices. Our expert team provides personalized care in a serene environment.",
  location: "123 Wellness Avenue, Beverly Hills, CA 90210",
  contact: "+1 (555) 123-4567",
  hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
  bio: "Founded in 2020, Serenity Spa & Wellness Center has become a premier destination for those seeking relaxation and rejuvenation. Our state-of-the-art facility combines traditional healing practices with modern wellness techniques.",
  website: "https://serenityspa.example.com",
  appointment_price: "150",
  consultation_price: "75",
  image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1000",
};

export const CreateBusinessForm = ({ onSuccess, onCancel, initialData }: FormProps) => {
  const {
    formData,
    setFormData,
    loading,
    pendingImage,
    setPendingImage,
    imageScale,
    setImageScale,
    imagePosition,
    setImagePosition,
    handleSubmit,
  } = useBusinessForm(initialData || TEST_BUSINESS, onSuccess);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BusinessBasicInfo formData={formData} onChange={handleChange} />
      <BusinessProfileInfo formData={formData} onChange={handleChange} />
      <BusinessPricing formData={formData} onChange={handleChange} />
      <BusinessContactInfo formData={formData} onChange={handleChange} />

      <div className="space-y-2">
        <Label>Business Image</Label>
        <ImageUpload
          selectedImage={pendingImage || formData.image}
          onImageSelect={(image) => setPendingImage(image)}
          initialScale={imageScale}
          initialPosition={imagePosition}
          onScaleChange={setImageScale}
          onPositionChange={setImagePosition}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (initialData ? "Updating..." : "Registering...") : (initialData ? "Update Business" : "Register Business")}
        </Button>
      </div>
    </form>
  );
};