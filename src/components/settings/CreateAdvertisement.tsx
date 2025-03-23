
import { CreateAdvertisement as AdvertisementForm } from "@/components/advertisements/CreateAdvertisement";

export const CreateAdvertisement = ({ onClose }: { onClose: () => void }) => {
  return <AdvertisementForm onClose={onClose} />;
};
