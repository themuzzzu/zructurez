import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X } from "lucide-react";
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
    images: [] as string[],
  });

  const handleImageAdd = (image: string | null) => {
    if (image && formData.images.length < 4) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, image]
      }));
    } else if (formData.images.length >= 4) {
      toast.error("Maximum 4 images allowed");
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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

    setLoading(true);

    try {
      // Upload all images first
      const imageUrls = await Promise.all(formData.images.map(uploadImage));

      // Create the service product
      const { data: product, error: productError } = await supabase
        .from('service_products')
        .insert([{
          service_id: serviceId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: imageUrls[0], // Use first image as main image
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Create product images entries
      if (imageUrls.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            imageUrls.map(url => ({
              product_id: product.id,
              image_url: url,
            }))
          );

        if (imagesError) throw imagesError;
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
        <Label>Product Images (Max 4)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <Card key={index} className="relative group">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleImageRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
          {formData.images.length < 4 && (
            <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
              <ImageUpload
                selectedImage={null}
                onImageSelect={handleImageAdd}
              />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
};