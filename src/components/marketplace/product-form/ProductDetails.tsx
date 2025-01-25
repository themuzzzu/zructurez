import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormProps } from "./types";

export const ProductDetails = ({ formData, onChange }: ProductFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="stock">Stock *</Label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => onChange("stock", e.target.value)}
          placeholder="Enter stock quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={formData.size}
          onChange={(e) => onChange("size", e.target.value)}
          placeholder="Enter size (optional)"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_used">Used Product</Label>
        <Switch
          id="is_used"
          checked={formData.is_used}
          onCheckedChange={(checked) => onChange("is_used", checked)}
        />
      </div>

      {formData.is_used && (
        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => onChange("condition", value)}
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
    </div>
  );
};