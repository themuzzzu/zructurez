import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BusinessFormData } from "./types";

interface BusinessBasicInfoProps {
  formData: BusinessFormData;
  onChange: (name: string, value: any) => void;
}

export const BusinessBasicInfo = ({ formData, onChange }: BusinessBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter your business name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beauty">Beauty & Wellness</SelectItem>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="health">Health & Medical</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="home">Home Services</SelectItem>
            <SelectItem value="professional">Professional Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your business"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment_price">Appointment Price (₹)</Label>
        <Input
          id="appointment_price"
          type="number"
          value={formData.appointment_price}
          onChange={(e) => onChange("appointment_price", e.target.value)}
          placeholder="Enter appointment price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultation_price">Consultation Price (₹)</Label>
        <Input
          id="consultation_price"
          type="number"
          value={formData.consultation_price}
          onChange={(e) => onChange("consultation_price", e.target.value)}
          placeholder="Enter consultation price"
        />
      </div>
    </>
  );
};