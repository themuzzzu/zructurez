import { Card } from "@/components/ui/card";

interface BusinessServicesTabProps {
  appointmentPrice: number | null;
  consultationPrice: number | null;
}

export const BusinessServicesTab = ({ appointmentPrice, consultationPrice }: BusinessServicesTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Services</h2>
      {appointmentPrice && (
        <div className="mb-2">
          <span className="font-medium">Appointment Price:</span> ₹{appointmentPrice}
        </div>
      )}
      {consultationPrice && (
        <div>
          <span className="font-medium">Consultation Price:</span> ₹{consultationPrice}
        </div>
      )}
    </Card>
  );
};