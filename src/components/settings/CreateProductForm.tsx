import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfo } from "../marketplace/product-form/BasicInfo";
import { PricingInfo } from "../marketplace/product-form/PricingInfo";
import { ProductDetails } from "../marketplace/product-form/ProductDetails";
import { Label } from "../ui/label";
import type { ProductFormData } from "../marketplace/product-form/types";

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export const CreateProductForm = ({ onSuccess }: CreateProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "0",
    size: "",
    is_discounted: false,
    discount_percentage: "",
    is_used: false,
    condition: "",
    image: null,
    is_branded: false,
    brand_name: "",
    model: "",
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
          .from('product-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { data: product, error } = await supabase
        .from('products')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          subcategory: formData.subcategory || null,
          stock: parseInt(formData.stock),
          size: formData.size || null,
          is_discounted: formData.is_discounted,
          discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
          is_used: formData.is_used,
          condition: formData.condition || null,
          image_url: imageUrl,
          is_branded: formData.is_branded,
          brand_name: formData.brand_name || null,
          model: formData.model || null,
        }])
        .select()
        .single();

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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Product Image</Label>
          <ImageUpload
            selectedImage={formData.image}
            onImageSelect={(image) => handleChange("image", image)}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};