import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ProductFormProps } from "./types";

export const BrandInfo = ({ formData, onChange }: ProductFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="is_branded">Branded Product</Label>
        <Switch
          id="is_branded"
          checked={formData.is_branded}
          onCheckedChange={(checked) => onChange("is_branded", checked)}
        />
      </div>

      {formData.is_branded && (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => onChange("brand_name", e.target.value)}
              placeholder="Enter brand name"
              required={formData.is_branded}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model (Optional)</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => onChange("model", e.target.value)}
              placeholder="Enter model"
            />
          </div>
        </>
      )}
    </div>
  );
};