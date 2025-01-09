import { Button } from "./ui/button";
import { ImageUpload } from "./ImageUpload";
import { BusinessBasicInfo } from "./business-form/BusinessBasicInfo";
import { BusinessPricing } from "./business-form/BusinessPricing";
import { BusinessContactInfo } from "./business-form/BusinessContactInfo";
import { BusinessProfileInfo } from "./business-form/BusinessProfileInfo";
import { Label } from "./ui/label";
import { useBusinessForm } from "./business-form/useBusinessForm";
import type { FormProps } from "./business-form/types/form";

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
  owners: [
    {
      name: "Isabella Martinez",
      role: "Founder & CEO",
      position: "Master Aesthetician",
      experience: "18 years",
      qualifications: "Licensed Aesthetician, Certified Spa Director",
      image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Sophie Chen",
      role: "Co-Owner",
      position: "Wellness Director",
      experience: "15 years",
      qualifications: "PhD in Holistic Medicine, Certified Yoga Instructor",
      image_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Amanda Thompson",
      role: "Partner",
      position: "Head of Therapeutic Services",
      experience: "12 years",
      qualifications: "Licensed Massage Therapist, Aromatherapy Specialist",
      image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
    }
  ],
  staff_details: [
    {
      name: "Sarah Williams",
      position: "Senior Massage Therapist",
      experience: "10 years",
      image_url: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Emily Davis",
      position: "Skincare Specialist",
      experience: "8 years",
      image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Maria Rodriguez",
      position: "Yoga Instructor",
      experience: "6 years",
      image_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Jessica Kim",
      position: "Nail Artist",
      experience: "7 years",
      image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "David Chen",
      position: "Acupuncturist",
      experience: "12 years",
      image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
    }
  ]
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData && !window.confirm('Are you sure you want to update this business?')) {
      return;
    }
    await handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-8">
        <div className="space-y-4">
          <BusinessBasicInfo formData={formData} onChange={handleChange} />
          <BusinessProfileInfo formData={formData} onChange={handleChange} />
          <BusinessPricing formData={formData} onChange={handleChange} />
          <BusinessContactInfo formData={formData} onChange={handleChange} />
        </div>

        <div className="space-y-4 border-t pt-6">
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Business Image</Label>
            <p className="text-sm text-muted-foreground">
              Upload a high-quality image that represents your business. This will be displayed on your business profile.
            </p>
            <ImageUpload
              selectedImage={pendingImage || formData.image}
              onImageSelect={(image) => setPendingImage(image)}
              initialScale={imageScale}
              initialPosition={imagePosition}
              onScaleChange={setImageScale}
              onPositionChange={setImagePosition}
              skipAutoSave={true}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
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