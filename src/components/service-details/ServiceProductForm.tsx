
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";
import { Card } from "@/components/ui/card";

interface ServiceProductFormProps {
  serviceId: string;
  onSuccess?: () => void;
}

export const ServiceProductForm = ({ serviceId, onSuccess }: ServiceProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    images: [] as (string | null)[],
  });

  const uploadImage = async (imageBase64: string) => {
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

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);

    try {
      // Filter out null images and only upload valid base64 images
      const validImages = formData.images.filter(img => img && img.startsWith('data:'));
      
      if (validImages.length === 0) {
        toast.error("Please provide at least one valid image");
        setLoading(false);
        return;
      }
      
      // Upload all images
      const imageUrls = await Promise.all(
        validImages.map(img => img ? uploadImage(img) : Promise.resolve(""))
      );
      
      // Filter out any empty strings
      const filteredImageUrls = imageUrls.filter(url => url);
      
      if (filteredImageUrls.length === 0) {
        toast.error("Failed to upload images");
        setLoading(false);
        return;
      }

      // Create the service product with the first image as main image
      const { data: product, error: productError } = await supabase
        .from('service_products')
        .insert([{
          service_id: serviceId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: filteredImageUrls[0], // Use first image as main image
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Create product images entries for additional images
      if (filteredImageUrls.length > 1) {
        const additionalImages = filteredImageUrls.slice(1).map((url, index) => ({
          service_product_id: product.id,
          image_url: url,
          display_order: index + 1, // Start from 1
        }));
        
        const { error: imagesError } = await supabase
          .from('service_product_images')
          .insert(additionalImages);

        if (imagesError) {
          console.error("Error inserting additional images:", imagesError);
        }
      }

      toast.success("Product added successfully!");
      onSuccess?.();
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "0",
        images: [],
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your product"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder="Enter stock quantity"
        />
      </div>

      <div className="space-y-2">
        <Label>Product Images (Up to 3) *</Label>
        <MultipleImageUpload
          selectedImages={formData.images}
          onImagesChange={(images) => setFormData({ ...formData, images })}
          maxImages={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
};
