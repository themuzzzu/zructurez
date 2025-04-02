
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessProduct } from "@/types/business";

interface BusinessProductFormProps {
  businessId: string;
  product?: BusinessProduct;
  onSuccess?: () => void;
}

export const BusinessProductForm = ({ businessId, product, onSuccess }: BusinessProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    image: null as string | null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "0",
        image: product.image_url || null,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      // Only upload a new image if it's a base64 string (new upload)
      if (formData.image && formData.image.startsWith('data:')) {
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
          .from('business-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('business_products')
          .update({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image_url: imageUrl,
          })
          .eq('id', product.id);

        if (error) throw error;
        
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        const { error } = await supabase
          .from('business_products')
          .insert([{
            business_id: businessId,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image_url: imageUrl,
          }]);

        if (error) throw error;
        
        toast.success("Product added to business successfully!");
      }
      
      onSuccess?.();
      
      if (!product) {
        // Only reset form if creating a new product
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "0",
          image: null,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(product ? "Failed to update product." : "Failed to add product. Please try again.");
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
        <Label>Product Image</Label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => setFormData({ ...formData, image })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (product ? "Updating Product..." : "Adding Product...") : (product ? "Update Product" : "Add Product")}
      </Button>
    </form>
  );
};
