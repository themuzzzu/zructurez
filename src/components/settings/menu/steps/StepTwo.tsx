
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepTwoProps {
  businessName: string;
  businessLocation: string;
  updateFormData: (data: { businessName: string; businessLocation: string }) => void;
  isLoading: boolean;
}

export const StepTwo = ({ 
  businessName, 
  businessLocation, 
  updateFormData,
  isLoading
}: StepTwoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Business Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This information is auto-filled from your business profile.
          You can update these details if needed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => updateFormData({ businessName: e.target.value, businessLocation })}
            placeholder="Your business name"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessLocation">Business Location</Label>
          <Input
            id="businessLocation"
            value={businessLocation}
            onChange={(e) => updateFormData({ businessName, businessLocation: e.target.value })}
            placeholder="Your business location"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
