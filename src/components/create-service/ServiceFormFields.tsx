import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CategorySelect } from "./CategorySelect";
import { ServiceWorks } from "./ServiceWorks";
import { MapLocationSelector } from "./MapLocationSelector";
import type { ServiceFormData } from "./ServiceFormTypes";

interface ServiceFormFieldsProps {
  formData: ServiceFormData;
  onChange: (name: string, value: string | any[]) => void;
}

export const ServiceFormFields = ({ formData, onChange }: ServiceFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Service Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Service Title"
          value={formData.title}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        />
      </div>

      <CategorySelect 
        value={formData.category}
        onChange={(value) => onChange("category", value)}
      />

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <MapLocationSelector
          value={formData.location}
          onChange={(value) => onChange("location", value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Information</Label>
        <Input
          id="contact_info"
          name="contact_info"
          placeholder="Contact Number (e.g., +91XXXXXXXXXX)"
          value={formData.contact_info}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Input
          id="availability"
          name="availability"
          placeholder="Availability (e.g., Mon-Fri 9AM-5PM)"
          value={formData.availability}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        />
      </div>

      <ServiceWorks
        works={formData.works || []}
        onChange={(works) => onChange("works", works)}
      />
    </>
  );
};