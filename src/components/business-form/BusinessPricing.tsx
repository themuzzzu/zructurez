import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface BusinessPricingProps {
  formData: {
    appointment_price: string;
    consultation_price: string;
  };
  onChange: (name: string, value: string) => void;
}

export const BusinessPricing = ({ formData, onChange }: BusinessPricingProps) => {
  const handlePriceTypeChange = (value: string) => {
    if (value === 'appointment') {
      onChange("consultation_price", "");
    } else {
      onChange("appointment_price", "");
    }
  };

  const currentType = formData.appointment_price ? 'appointment' : 'consultation';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Price Type</Label>
        <RadioGroup
          defaultValue={currentType}
          onValueChange={handlePriceTypeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="appointment" id="appointment" />
            <Label htmlFor="appointment">Appointment Price</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consultation" id="consultation" />
            <Label htmlFor="consultation">Consultation Price</Label>
          </div>
        </RadioGroup>
      </div>

      {currentType === 'appointment' ? (
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
      ) : (
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
      )}
    </div>
  );
};