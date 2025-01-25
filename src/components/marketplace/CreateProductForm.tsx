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
    condition: "",
    is_branded: false,
    brand_name: "",
    model: "",
    size: "",
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

    if (formData.is_used && !formData.condition) {
      toast.error("Please select product condition");
      return;
    }

    setLoading(true);

    try {
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
          user_id: businessId,
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
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          placeholder="Enter size (optional)"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is_used">Used Product</Label>
          <Switch
            id="is_used"
            checked={formData.is_used}
            onCheckedChange={(checked) => setFormData({ ...formData, is_used: checked })}
          />
        </div>

        {formData.is_used && (
          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData({ ...formData, condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="like_new">Like New</SelectItem>
                <SelectItem value="very_good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="is_branded">Branded Product</Label>
          <Switch
            id="is_branded"
            checked={formData.is_branded}
            onCheckedChange={(checked) => setFormData({ ...formData, is_branded: checked })}
          />
        </div>

        {formData.is_branded && (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                placeholder="Enter brand name"
                required={formData.is_branded}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model (Optional)</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Enter model"
              />
            </div>
          </>
        )}

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
          </div>
        )}

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
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Product..." : "Create Product"}
      </Button>
    </form>
  );
};