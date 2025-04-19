
import { AdCreationStepper } from "@/components/ads/AdCreationStepper";

export const CreateAdvertisement = ({ onClose }: { onClose: () => void }) => {
  return <AdCreationStepper onClose={onClose} />;
};
