
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ad Content</h3>
        <p className="text-sm text-muted-foreground">
          Enter the details for your advertisement
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter a compelling title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Add more details about your ad"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta">Call to Action Text</Label>
          <Input
            id="cta"
            value={data.ctaText}
            onChange={(e) => onChange({ ctaText: e.target.value })}
            placeholder="e.g., 'Shop Now', 'Learn More'"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Target Type</Label>
            <Select 
              value={data.targetType} 
              onValueChange={(value: TargetType) => onChange({ targetType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="url">External URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetId">
              {data.targetType === "url" ? "URL" : "ID"}
            </Label>
            <Input
              id="targetId"
              value={data.targetId}
              onChange={(e) => onChange({ targetId: e.target.value })}
              placeholder={data.targetType === "url" 
                ? "https://..." 
                : `Enter ${data.targetType} ID`
              }
              type={data.targetType === "url" ? "url" : "text"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
