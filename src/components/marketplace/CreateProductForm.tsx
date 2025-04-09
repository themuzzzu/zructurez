import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfo } from "./product-form/BasicInfo";
import { PricingInfo } from "./product-form/PricingInfo";
import { ProductDetails } from "./product-form/ProductDetails";
import { BrandInfo } from "./product-form/BrandInfo";
import { LabelsAttributes } from "./product-form/LabelsAttributes";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";
import type { ProductFormData } from "./product-form/types";

interface CreateProductFormProps {
  onSuccess?: () => void;
  businessId?: string;
}

export const CreateProductForm = ({ onSuccess, businessId }: CreateProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData & { images: (string | null)[] }>({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "1",
    image: null,
    images: [],
    is_discounted: false,
    discount_percentage: "",
    is_used: false,
    condition: "",
    is_branded: false,
    brand_name: "",
    model: "",
    size: "",
    labels: [],
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
    
    // Ensure at least one image is present
    if (!formData.image && (!formData.images || formData.images.length === 0)) {
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Keep track of all images to upload
      const imagesToUpload = formData.images.filter(img => img && img.startsWith('data:'));
      
      // Add main image to images array if it's not null and not already in the array
      if (formData.image && !formData.images.includes(formData.image)) {
        imagesToUpload.push(formData.image);
      }
      
      // Upload all images
      const imageUrls: string[] = [];
      
      for (const imageBase64 of imagesToUpload) {
        if (!imageBase64) continue;
        
        const base64Data = imageBase64.split(',')[1];
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

        imageUrls.push(publicUrl);
      }

      // Use the first image as the main product image
      const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
      
      const originalPrice = parseFloat(formData.price);
      const discountedPrice = formData.is_discounted 
        ? originalPrice - (originalPrice * (parseFloat(formData.discount_percentage) / 100))
        : originalPrice;

      // Insert the product first
      const { data: product, error } = await supabase
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
          image_url: mainImageUrl,
          stock: parseInt(formData.stock),
          is_discounted: formData.is_discounted,
          is_used: formData.is_used,
          condition: formData.condition,
          is_branded: formData.is_branded,
          brand_name: formData.brand_name || null,
          model: formData.model || null,
          size: formData.size || null,
          business_id: businessId || null,
        }])
        .select();

      if (error) throw error;
      
      // Insert additional product images if any
      const productId = product[0].id;
      
      if (imageUrls.length > 1) {
        // Skip the first one as it's already set as the main image
        const additionalImages = imageUrls.slice(1).map((url, index) => ({
          product_id: productId,
          image_url: url,
          display_order: index + 1, // Start from 1 since 0 is the main image
        }));
        
        if (additionalImages.length > 0) {
          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(additionalImages);
            
          if (imagesError) {
            console.error("Error inserting additional images:", imagesError);
          }
        }
      }
      
      // If we have labels, insert them as well
      if (formData.labels.length > 0 && product) {
        // Insert labels
        const labelsToInsert = formData.labels.map(label => ({
          product_id: productId,
          name: label.name,
          attributes: label.attributes
        }));
        
        const { error: labelsError } = await supabase
          .from("product_labels")
          .insert(labelsToInsert);
          
        if (labelsError) {
          console.error("Error inserting labels:", labelsError);
          // Continue with success even if labels fail
        }
      }

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
      <LabelsAttributes formData={formData} onChange={handleChange} />

      <div className="space-y-2">
        <Label>Product Images (Up to 3)</Label>
        <MultipleImageUpload
          selectedImages={formData.images}
          onImagesChange={(images) => handleChange("images", images)}
          maxImages={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Product..." : "Create Product"}
      </Button>
    </form>
  );
};
