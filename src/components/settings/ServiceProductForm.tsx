
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface ServiceProductFormProps {
  serviceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export const ServiceProductForm = ({ serviceId, initialData, onSuccess }: ServiceProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    image: null as string | null,
    category: "general" // Default category
  });

  // Initialize form with initialData when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        stock: initialData.stock?.toString() || "0",
        image: initialData.image_url || null,
        category: initialData.category || "general"
      });
    }
  }, [initialData]);

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
          .from('service-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (initialData) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            title: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image_url: imageUrl,
            category: formData.category
          })
          .eq('id', initialData.id);

        if (error) throw error;
        
        toast.success("Product updated successfully!");
      } else {
        // Create new product - Make sure to include all required fields
        const { error } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            title: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image_url: imageUrl,
            category: formData.category // This was missing and is required
          });

        if (error) throw error;
        
        toast.success("Product added successfully!");
      }
      
      onSuccess?.();
      
      if (!initialData) {
        // Only reset form if creating a new product
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "0",
          image: null,
          category: "general"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(initialData ? "Failed to update product." : "Failed to add product. Please try again.");
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
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="beauty">Beauty & Health</SelectItem>
            <SelectItem value="sports">Sports & Outdoors</SelectItem>
            <SelectItem value="toys">Toys & Games</SelectItem>
            <SelectItem value="books">Books & Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
        {loading ? (initialData ? "Updating Product..." : "Adding Product...") : (initialData ? "Update Product" : "Add Product")}
      </Button>
    </form>
  );
};
