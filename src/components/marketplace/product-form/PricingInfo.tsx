import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ProductFormProps } from "./types";

export const PricingInfo = ({ formData, onChange }: ProductFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_discounted">Discounted</Label>
        <Switch
          id="is_discounted"
          checked={formData.is_discounted}
          onCheckedChange={(checked) => onChange("is_discounted", checked)}
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
            onChange={(e) => onChange("discount_percentage", e.target.value)}
            placeholder="Enter discount percentage"
            required
          />
        </div>
      )}
    </div>
  );
};