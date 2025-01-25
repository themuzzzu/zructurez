import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfo } from "./product-form/BasicInfo";
import { PricingInfo } from "./product-form/PricingInfo";
import { ProductDetails } from "./product-form/ProductDetails";
import { BrandInfo } from "./product-form/BrandInfo";
import type { ProductFormData } from "./product-form/types";

interface CreateProductFormProps {
  onSuccess?: () => void;
  businessId?: string;
}

export const CreateProductForm = ({ onSuccess, businessId }: CreateProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "1",
    image: null,
    is_discounted: false,
    discount_percentage: "",
    is_used: false,
    condition: "",
    is_branded: false,
    brand_name: "",
    model: "",
    size: "",
  });

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.is_discounted && !formData.discount_percentage) {
      toast.error("Please enter discount percentage");
      return;
    }

    if (formData.is_used && !formData.condition) {
      toast.error("Please select product condition");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

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
          .from('product-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const originalPrice = parseFloat(formData.price);
      const discountedPrice = formData.is_discounted 
        ? originalPrice - (originalPrice * (parseFloat(formData.discount_percentage) / 100))
        : originalPrice;

      const { error } = await supabase
        .from('products')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: discountedPrice,
          original_price: formData.is_discounted ? originalPrice : null,
          discount_percentage: formData.is_discounted ? parseFloat(formData.discount_percentage) : null,
          category: formData.category,
          subcategory: formData.subcategory || null,
          image_url: imageUrl,
          stock: parseInt(formData.stock),
          is_discounted: formData.is_discounted,
          is_used: formData.is_used,
          condition: formData.condition,
          is_branded: formData.is_branded,
          brand_name: formData.brand_name || null,
          model: formData.model || null,
          size: formData.size || null,
          business_id: businessId || null,
        }]);

      if (error) throw error;

      toast.success("Product created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfo formData={formData} onChange={handleChange} />
      <PricingInfo formData={formData} onChange={handleChange} />
      <ProductDetails formData={formData} onChange={handleChange} />
      <BrandInfo formData={formData} onChange={handleChange} />

      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => handleChange("image", image)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Product..." : "Create Product"}
      </Button>
    </form>
  );
};