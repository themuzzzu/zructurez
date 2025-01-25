import { BusinessSubscribeButton } from "../BusinessSubscribeButton";
import { BusinessMembershipButton } from "../BusinessMembershipButton";

interface BusinessActionButtonsProps {
  businessId: string;
}

export const BusinessActionButtons = ({ businessId }: BusinessActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BusinessSubscribeButton businessId={businessId} />
      <BusinessMembershipButton businessId={businessId} />
    </div>
  );
};