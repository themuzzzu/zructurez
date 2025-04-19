
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdFormData, TargetType } from "../types";

interface AdContentProps {
  data: AdFormData;
  onChange: (data: Partial<AdFormData>) => void;
}

export const AdContent = ({ data, onChange }: AdContentProps) => {
  const [targetType, setTargetType] = useState<TargetType>(data.targetType);

  const handleTargetTypeChange = (type: TargetType) => {
    setTargetType(type);
    onChange({ targetType: type });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Advertisement Content</h3>
        <p className="text-sm text-muted-foreground">
          Enter the details for your advertisement
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter a compelling title for your advertisement"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your offering in detail"
            rows={4}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cta">Call to Action Text</Label>
          <Input
            id="cta"
            value={data.ctaText}
            onChange={(e) => onChange({ ctaText: e.target.value })}
            placeholder="e.g., Shop Now, Learn More, Sign Up"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="target-type">Target Type</Label>
          <Select 
            value={targetType} 
            onValueChange={(value: TargetType) => handleTargetTypeChange(value)}
          >
            <SelectTrigger id="target-type">
              <SelectValue placeholder="Select what your ad links to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="url">External URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="target-id">
            {targetType === "url" ? "URL" : `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} ID`}
          </Label>
          <Input
            id="target-id"
            value={data.targetId}
            onChange={(e) => onChange({ targetId: e.target.value })}
            placeholder={
              targetType === "url" 
                ? "https://example.com/page" 
                : `Enter the ${targetType} ID`
            }
          />
        </div>
      </div>
    </div>
  );
};
