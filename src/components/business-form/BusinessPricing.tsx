import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface BusinessPricingProps {
  formData: {
    appointment_price: string;
    consultation_price: string;
  };
  onChange: (name: string, value: string) => void;
}

export const BusinessPricing = ({ formData, onChange }: BusinessPricingProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="appointment_price">Appointment Price (₹)</Label>
        <Input
          id="appointment_price"
          type="number"
          min="0"
          step="0.01"
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
          min="0"
          step="0.01"
          value={formData.consultation_price}
          onChange={(e) => onChange("consultation_price", e.target.value)}
          placeholder="Enter consultation price"
        />
      </div>
    </>
  );
};