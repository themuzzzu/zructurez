import { Button } from "./ui/button";
import { ImageUpload } from "./ImageUpload";
import { BusinessBasicInfo } from "./business-form/BusinessBasicInfo";
import { BusinessPricing } from "./business-form/BusinessPricing";
import { BusinessContactInfo } from "./business-form/BusinessContactInfo";
import { BusinessProfileInfo } from "./business-form/BusinessProfileInfo";
import { Label } from "./ui/label";
import { useBusinessForm } from "./business-form/useBusinessForm";
import type { FormProps } from "./business-form/types/form";

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
  } = useBusinessForm(initialData, onSuccess);

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
          selectedImage={pendingImage}
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