import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface BusinessPricingProps {
  formData: {
    appointment_price: string;
    consultation_price: string;
  };
  onChange: (name: string, value: string) => void;
}

export const BusinessPricing = ({ formData, onChange }: BusinessPricingProps) => {
  const handlePriceTypeChange = (type: string, checked: boolean) => {
    if (!checked) {
      onChange(type === 'appointment' ? "appointment_price" : "consultation_price", "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Price Types</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="appointment"
              checked={!!formData.appointment_price}
              onCheckedChange={(checked) => handlePriceTypeChange('appointment', checked as boolean)}
            />
            <Label htmlFor="appointment">Appointment Price</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consultation"
              checked={!!formData.consultation_price}
              onCheckedChange={(checked) => handlePriceTypeChange('consultation', checked as boolean)}
            />
            <Label htmlFor="consultation">Consultation Price</Label>
          </div>
        </div>
      </div>

      {!!formData.appointment_price || formData.appointment_price === "" ? (
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
      ) : null}

      {!!formData.consultation_price || formData.consultation_price === "" ? (
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
      ) : null}
    </div>
  );
};