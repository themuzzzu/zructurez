import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CreateProductFormProps {
  businessId: string;
  onSuccess?: () => void;
}

export const CreateProductForm = ({ businessId, onSuccess }: CreateProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "1",
    image: null as string | null,
    is_discounted: false,
    discount_percentage: "",
    is_used: false,
    is_branded: false,
    brand_name: "",
    condition: "",
    model: "",
  });

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
          is_branded: formData.is_branded,
          brand_name: formData.brand_name || null,
          condition: formData.condition || null,
          model: formData.model || null,
        }]);

      if (error) throw error;

      toast.success("Product listed successfully!");
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to list product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Product Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter product title"
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
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="sports">Sports & Outdoors</SelectItem>
            <SelectItem value="books">Books & Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="stock">Stock *</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder="Enter stock quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => setFormData({ ...formData, image })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is_discounted">Discounted</Label>
          <Switch
            id="is_discounted"
            checked={formData.is_discounted}
            onCheckedChange={(checked) => setFormData({ ...formData, is_discounted: checked })}
          />
        </div>

        {formData.is_discounted && (
          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
            <Input
              id="discount_percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
              placeholder="Enter discount percentage"
              required
            />
            {formData.price && formData.discount_percentage && (
              <div className="text-sm text-muted-foreground">
                Original Price: ₹{formData.price}
                <br />
                Discounted Price: ₹{(parseFloat(formData.price) - (parseFloat(formData.price) * (parseFloat(formData.discount_percentage) / 100))).toFixed(2)}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="brand_name">Brand Name</Label>
          <Input
            id="brand_name"
            value={formData.brand_name}
            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
            placeholder="Enter brand name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model/Version</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Enter model or version (optional)"
          />
        </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Product..." : "Create Product"}
      </Button>
    </form>
  );
};
